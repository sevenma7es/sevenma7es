import { Router } from "express";
import User from "../../../models/user.js";
import passport from "passport";

const adminSessionRouter = Router();

// User registration
adminSessionRouter.post(
  "/register",
  passport.authenticate("register", {
    failurlRedirect: "/api/admin/registerFail",
  }),
  async (req, res, next) => {
    try {
      const { email, full_name, roles } = req.user;
      res.redirect(`/admin`);
    } catch (error) {
      next(error);
    }
  }
);

// Registration failure route
adminSessionRouter.get("/registerFail", (req, res) => {
  res.status(401).send({ status: "error", error: "Authentication error" });
});

adminSessionRouter.post("/login", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      if (info && info.message === "User not found or not an admin") {
        return res.status(401).json({
          status: "fail",
          message: "User not found or not an admin",
          action: "redirect",
        });
      } else if (info && info.message === "User not an admin") {
        return res.status(401).json({
          status: "fail",
          message: "User not an admin",
          action: "redirect",
        });
      } else {
        return res.status(401).json({
          status: "fail",
          message: "Incorrect email or password",
          action: "warning",
        });
      }
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const { _id, email, name, roles, createdAt, updatedAt } = req.user;
      req.session.user = {
        _id,
        email,
        name,
        roles,
        createdAt,
        updatedAt,
      };
      return res.json({ status: "success", user: user });
    });
  })(req, res, next);
});

// Login failure route
adminSessionRouter.get("/login-fail", (req, res) => {
  res.redirect("/admin/login-fail");
});

// Logout route
adminSessionRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error destroying session");
    res.status(200).send("Loged out");
  });
});

// Github authentication route
adminSessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Github authentication callback route
adminSessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    const { first_name, email, age } = req.user;
    req.session.user = { name: first_name, email, age };

    res.redirect("/");
  }
);

// Route to get current user session
adminSessionRouter.get("/current", (req, res) => {
  if (req.session.user) {
    res.send({ user: req.session.user });
  } else {
    res.status(401).send({ error: "No user logged in" });
  }
});

export default adminSessionRouter;
