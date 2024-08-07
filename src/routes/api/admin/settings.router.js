import { Router } from "express";
import UserController from "../../../controllers/user.controller.js";
import SettingsController from "../../../controllers/settings.controller.js";

const adminSettingsRouter = Router();
const userController = new UserController();
const settingsController = new SettingsController();

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

adminSettingsRouter.post("/", privateAccess, async (req, res) => {
  try {
    await settingsController.addSettings(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

adminSettingsRouter.put("/", privateAccess, async (req, res) => {
  try {
    await settingsController.updateSettings(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default adminSettingsRouter;
