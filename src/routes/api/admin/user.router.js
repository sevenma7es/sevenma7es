import { Router } from "express";
import User from "../../../models/user.js";
import UserController from "../../../controllers/user.controller.js";
import { logger } from "../../../utils/logger.js";

const adminUserRouter = Router();
const userController = new UserController();

// Middleware for public access
const publicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/admin");
  next();
};

// Middleware for private access
const privateAccess = async (req, res, next) => {
  if (!req.session.user) {
    const users = await userController.isThereAnAdmin();

    if (users.status == "error") {
      logger.error(users.message);
      return res.redirect("/admin/register");
    } else {
      return res.redirect("/admin/login");
    }
  }
  next();
};

adminUserRouter.get("/users_stats", async (req, res) => {
  try {
    const userStats = await userController.getUserStats();
    res.json({ status: "success", data: userStats });
  } catch (error) {
    logger.error("Error getting user stats:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error getting user stats" });
  }
});

adminUserRouter.get("/search", privateAccess, async (req, res) => {
  try {
    const findBy = req.query.findBy || "";
    const query = req.query.query || "";
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const response = await userController.getAllUsers(
      req,
      res,
      query,
      limit,
      page
    );
    const users = response.ResultSet;

    const totalUsers = await userController.countUsers(query);
    const usersPerPage = 10;
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    res.json({ users, pages });
  } catch (error) {
    logger.error("Error al buscar usuarios:", error);
    res.status(500).send("Error al buscar usuarios");
  }
});

export default adminUserRouter;
