import { Router } from "express";
import ProductsController from "../../../controllers/products.controller.js";
import UserController from "../../../controllers/user.controller.js";
import { logger } from "../../../utils/logger.js";
import { upload, convertAndSave } from "../../../config/multer.config.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminProductsRouter = Router();
const productController = new ProductsController();
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

adminProductsRouter.post("/", privateAccess, upload.array("productImages", 5), convertAndSave, async (req, res) => {
  try {
    await productController.addProduct(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

adminProductsRouter.put("/", privateAccess, upload.array("productImages", 5), convertAndSave, async (req, res) => {
  try {
    if (req.body.id) {
      await productController.updateProduct(req, res);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

adminProductsRouter.delete("/delete-product/:pslug", async (req, res) => {
  try {
    await productController.deleteProduct(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

adminProductsRouter.get("/products_stats", privateAccess, async (req, res) => {
  try {
    await productController.getProductStats(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

adminProductsRouter.get("/search", privateAccess, async (req, res) => {
  try {
    const findBy = req.query.findBy || "";
    const query = req.query.query || "";
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const response = await productController.getProducts(req, res, query, limit, page);
    const products = response.ResultSet;
    const totalProducts = await productController.countProducts(query);
    const productsPerPage = 10;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    res.json({ products, pages });
  } catch (error) {
    logger.error("Error al buscar productos:", error);
    res.status(500).send("Error al buscar productos");
  }
});

adminProductsRouter.delete("/image/delete", (req, res) => {
  const { imagePath } = req.body;
  const fullPath = path.join(__dirname, "../../../public", imagePath);

  fs.unlink(fullPath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error eliminando imagen", error: err });
    }
    res.status(200).json({ message: "Imagen eliminada con éxito" });
  });
});

export default adminProductsRouter;
