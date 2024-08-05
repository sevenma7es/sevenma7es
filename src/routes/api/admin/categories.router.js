import { Router } from "express";
import CategoriesController from "../../../controllers/categories.controller.js";
import UserController from "../../../controllers/user.controller.js";
import { logger } from "../../../utils/logger.js";

const adminCategoriesRouter = Router();
const categoriesController = new CategoriesController();
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

adminCategoriesRouter.post("/", privateAccess, async (req, res) => {
  try {
    await categoriesController.addCategory(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

adminCategoriesRouter.put("/", privateAccess, async (req, res) => {
  try {
    if (req.body.id) {
      await categoriesController.updateCategory(req, res);
    } else {
      res.status(400).json({ error: "ID is required" });
    }
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminCategoriesRouter.get("/search", privateAccess, async (req, res) => {
  try {
    const findBy = req.query.findBy || "";
    const query = req.query.query || "";
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const response = await categoriesController.getCategories(req, res, query, limit, page);
    const categories = response.ResultSet;
    const totalCategories = await categoriesController.countCategories(query);
    const categoriesPerPage = 10;
    const totalPages = Math.ceil(totalCategories / categoriesPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    res.json({ categories, pages });
  } catch (error) {
    logger.error("Error al buscar categorías:", error);
    res.status(500).send("Error al buscar categorías");
  }
});

adminCategoriesRouter.delete("/delete-category/:pslug", async (req, res) => {
  try {
    await categoriesController.deleteCategory(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default adminCategoriesRouter;
