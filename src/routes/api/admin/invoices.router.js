import { Router } from "express";
import InvoicesController from "../../../controllers/invoices.controller.js";
import UserController from "../../../controllers/user.controller.js";
import { logger } from "../../../utils/logger.js";

const adminInvoicesRouter = Router();
const invoicesController = new InvoicesController();
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

adminInvoicesRouter.get(
  "/total_invoices_by_month",
  privateAccess,
  async (req, res) => {
    try {
      const total_invoices_by_month =
        await invoicesController.getTotalInvoicesByMonth(req, res);
      res.json({ status: "success", total_invoices_by_month });
    } catch (error) {
      logger.error("Error getting user stats:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error getting user stats" });
    }
  }
);

adminInvoicesRouter.get(
  "/total_amount_by_month",
  privateAccess,
  async (req, res) => {
    try {
      const total_amount_by_month =
        await invoicesController.getTotalAmountByMonth(req, res);
      res.json({ status: "success", total_amount_by_month });
    } catch (error) {
      logger.error("Error getting user stats:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error getting user stats" });
    }
  }
);

adminInvoicesRouter.get(
  "/invoices_by_type",
  privateAccess,
  async (req, res) => {
    try {
      const invoices_by_type = await invoicesController.getInvoicesByType(
        req,
        res
      );
      res.json({ status: "success", invoices_by_type });
    } catch (error) {
      logger.error("Error getting user stats:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error getting user stats" });
    }
  }
);

export default adminInvoicesRouter;
