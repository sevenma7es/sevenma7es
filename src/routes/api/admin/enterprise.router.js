import { Router } from "express";
import EnterpriseController from "../../../controllers/enterprise.controller.js";
import UserController from "../../../controllers/user.controller.js";

const adminEnterpriseRouter = Router();
const enterpriseController = new EnterpriseController();
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

adminEnterpriseRouter.post("/", privateAccess, async (req, res) => {
  try {
    await enterpriseController.addEnterprise(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

adminEnterpriseRouter.put("/", privateAccess, async (req, res) => {
  try {
    await enterpriseController.updateEnterprise(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
export default adminEnterpriseRouter;
