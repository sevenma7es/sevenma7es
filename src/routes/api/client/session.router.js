import { Router } from "express";
import User from "../../../models/user.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { HOST, JWT_SK } from "../../../config/env.js";
import { generateToken, isValidPassword } from "../../../utils/functions.js";
import { createHash } from "../../../utils/passwordUtils.js";

const clientSessionRouter = Router();

// User registration
clientSessionRouter.post(
  "/register",
  passport.authenticate("client-register", {
    failurlRedirect: "/api/client/registerFail",
  }),
  async (req, res, next) => {
    try {
      const { email, full_name, roles } = req.user;

      res
        .status(200)
        .json({ email: email, full_name: full_name, roles: roles });
    } catch (error) {
      next(error);
    }
  }
);
clientSessionRouter.post("/login", (req, res, next) => {
  passport.authenticate("client-login", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      if (info && info.message === "User not found.") {
        return res.status(401).json({
          status: "fail",
          message: "User not found.",
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
      const { _id, email, full_name, roles, createdAt, updatedAt } = req.user;

      req.session.user = {
        _id,
        email,
        full_name,
        roles,
        createdAt,
        updatedAt,
      };
      return res.json({ status: "success", user: user });
    });
  })(req, res, next);
});

// Login failure route
clientSessionRouter.get("/login-fail", (req, res) => {
  res.redirect("/client/login-fail");
});

// Logout route
clientSessionRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error destroying session");
    res.status(200).send("Loged out");
  });
});

// Github authentication route
clientSessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Github authentication callback route
clientSessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    const { first_name, email, age } = req.user;
    req.session.user = { name: first_name, email, age };

    res.redirect("/");
  }
);

// Route to get current user session
clientSessionRouter.get("/current", (req, res) => {
  if (req.session.user) {
    res.send({ user: req.session.user });
  } else {
    res.status(401).send({ error: "No user logged in" });
  }
});

clientSessionRouter.post("/account/request-reset", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const token = generateToken();
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000;
  await user.save();

  const data = {
    token,
    user: {
      email: user.email,
      full_name: user.full_name,
    },
  };

  try {
    const response = await fetch(
      `${HOST}/api/client/mailer/account/request-reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      }
    );

    if (response.ok) {
      return res.redirect("/ingresar");
    } else {
      const errorData = await response.text();
      console.error("Error response from email service:", errorData);
      return res.status(500).json({ error: "Error sending email" });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Error sending email" });
  }
});

clientSessionRouter.post("/account/reset-password/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Token is invalid or has expired" });
    }

    if (isValidPassword(user, password)) {
      return res
        .status(400)
        .json({ error: "New password cannot be the same as the old password" });
    }

    user.password = createHash(password);
    console.log("Password");
    user.resetToken = undefined;
    console.log("Token");
    user.resetTokenExpiry = undefined;
    console.log("Reset token");
    await user.save();

    res.redirect("/ingresar");
  } catch (error) {
    console.log("Error: ", error);
  }
});

export default clientSessionRouter;
