import { fileURLToPath } from "url";
import ProductsDAO from "../dao/products.dao.js";
import CategoriesDAO from "../dao/categories.dao.js";
import Product from "../models/product.js";
import { logger } from "../utils/logger.js";
import path from "path";
import cloudinary from "../config/cloudinary.config.js";

const productsDAO = new ProductsDAO();
const categoriesDAO = new CategoriesDAO();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ProductsController {
  async getProducts(req, res, query, limit, page, sort) {
    try {
      const { query, findBy } = req.query || {};
      const filter = {};

      if (query) {
        filter["$or"] = [
          {
            [findBy]: { $regex: query, $options: "i" },
          },
        ];
      }

      const sortOptions = {};
      if (sort) {
        sortOptions.price = sort === "asc" ? 1 : -1;
      }

      let products;
      if (query) {
        products = await productsDAO.getProducts(limit, page, {}, filter);
      } else {
        products = await productsDAO.getProducts(limit, page, sortOptions, filter);
      }

      const totalProducts = await productsDAO.countProducts(filter);
      const totalPages = Math.ceil(totalProducts / limit);

      const result = {
        status: "success",
        ResultSet: products,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
        nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}` : null,
      };

      return result;
    } catch (error) {
      const stackTrace = error.stack.split("\n");
      const errorLine = stackTrace.find((line) => line.includes("at getProducts"));

      logger.error(`Error in /products route: ${errorLine}`, error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }

  async findByKeywords(req, res, req_keywords, limit, page, sort) {
    try {
      const { findBy } = req.query || {};
      const keywords = req_keywords;
      const filter = {};

      if (keywords) {
        filter["$or"] = [
          {
            title: { $regex: keywords, $options: "i" },
          },
          {
            description: { $regex: keywords, $options: "i" },
          },
        ];
      }

      const sortOptions = {};
      if (sort) {
        sortOptions.price = sort === "asc" ? 1 : -1;
      }

      let products;
      if (keywords) {
        products = await productsDAO.getProducts(limit, page, sortOptions, filter);
      }

      const totalProducts = await productsDAO.countProducts(filter);
      const totalPages = Math.ceil(totalProducts / limit);

      const result = {
        status: "success",
        ResultSet: products,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
        nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}` : null,
      };

      return result;
    } catch (error) {
      const stackTrace = error.stack.split("\n");
      const errorLine = stackTrace.find((line) => line.includes("at findByKeywords"));

      logger.error(`Error in /products route: ${errorLine}`, error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }

  async findByCategory(req, res, req_category, limit, page) {
    try {
      const { sort } = req.query || {};
      const categorySlug = req_category;

      const category = await categoriesDAO.findBySlug(categorySlug);

      if (!category) {
        throw new Error("Category not found");
      }

      const categories = await categoriesDAO.findSubcategories(category._id);

      const categoryIds = categories.map((cat) => cat._id);

      const filter = {
        category: { $in: categoryIds },
      };

      const sortOptions = {};
      if (sort) {
        sortOptions.price = sort === "asc" ? 1 : -1;
      }

      const products = await productsDAO.getProducts(limit, page, sortOptions, filter);

      const totalProducts = await productsDAO.countProducts(filter);
      const totalPages = Math.ceil(totalProducts / limit);

      const result = {
        status: "success",
        ResultSet: products,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
        nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}` : null,
      };

      return result;
    } catch (error) {
      logger.error(`Error in findByCategory: ${error.message}`, error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }

  async findById(paramproductId) {
    try {
      const productId = paramproductId;
      const product = await productsDAO.getProductById(productId);
      return product;
    } catch (error) {
      logger.error("[Controller] Error getting product by ID:", error);
      throw error;
    }
  }

  async findBySlug(productSlug) {
    try {
      const product_slug = productSlug;
      const product = await productsDAO.getProductBySlug(product_slug);
      return product;
    } catch (error) {
      logger.error("[Controller] Error getting product by Slug:", error);
      throw error;
    }
  }

  async findByFeatured() {
    try {
      const product = await productsDAO.getFeaturedProducts();
      return product;
    } catch (error) {
      logger.error("[Controller] Error getting product by Slug:", error);
      throw error;
    }
  }

  async countProducts() {
    try {
      const totalProducts = await Product.countDocuments();
      return totalProducts;
    } catch (error) {
      logger.error("[Controller] Error contando productos:", error);
      throw error;
    }
  }

  async addProduct(req, res) {
    try {
      const productData = req.body;
      productData.owner = req.session.user._id;

      if (req.files) {
        productData.images = req.files.map((file) => file.path);
      }

      const result = await productsDAO.addProduct(productData);

      if (result.status === "error") {
        return res.status(500).json(result);
      }

      return res.json(result);
    } catch (error) {
      logger.error("[Controller] Error adding product:", error);
      return res.status(500).json({ error: "[Controller] Error adding product" });
    }
  }

  async updateProduct(req, res) {
    try {
      const productData = req.body;

      if (req.body.id) {
        const productId = req.body.id;
        const existingProduct = await productsDAO.getProductById(productId);

        if (!existingProduct) {
          return res.status(404).json({ error: "Producto no encontrado" });
        }

        if (req.files) {
          const newImages = req.files.map((file) => file.path);
          productData.images = [...existingProduct.images, ...newImages];
        } else {
          productData.images = existingProduct.images;
        }

        const result = await productsDAO.updateProduct(productData);

        if (result.status === "error") {
          return res.status(500).json(result);
        }

        return res.json(result);
      } else {
        return res.status(400).json({ error: "ID de producto es requerido" });
      }
    } catch (error) {
      logger.error("[Controller] Error updating product:", error);
      return res.status(500).json({ error: "Error updating product" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productSlug = req.params.pslug;
      const user = req.session.user;
      const result = await productsDAO.deleteProduct(productSlug, user);

      if (result.error) {
        return res.status(403).json({ error: result.error });
      }

      if (result.product && result.product.images) {
        const deletePromises = result.product.images.map((imageUrl) => {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(`product_images/${publicId}`);
        });
        await Promise.all(deletePromises);
      }

      return res.json(result);
    } catch (error) {
      logger.error("[Controller] Error deleting product:", error);
      return res.status(500).json({ error: "Error deleting product" });
    }
  }

  async getProductStats(req, res) {
    try {
      const totalProducts = await productsDAO.countProducts({});
      const productsByCategory = await Product.aggregate([{ $unwind: "$categories" }, { $group: { _id: "$categories", count: { $sum: 1 } } }]);
      const lowStockProducts = await Product.find({ stock: { $lt: 10 } });

      res.json({
        status: "success",
        data: {
          totalProducts,
          productsByCategory,
          lowStockProducts,
        },
      });
    } catch (error) {
      logger.error("[Controller] Error fetching product stats:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }
}
