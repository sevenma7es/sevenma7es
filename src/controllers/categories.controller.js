import CategoriesDAO from "../dao/categories.dao.js";
import Category from "../models/category.js";
import { logger } from "../utils/logger.js";

const categoriesDAO = new CategoriesDAO();

export default class CategoriesController {
  async getAll() {
    try {
      const categories = await categoriesDAO.getAll();
      return categories;
    } catch (error) {
      logger.error("Error getting categories:", error);
    }
  }

  async getCategories(req, res, query, limit, page) {
    try {
      const { sort, query, findBy } = req.query || {};
      const filter = {};

      if (query) {
        filter["$or"] = [{ [findBy]: { $regex: query, $options: "i" } }];
      }

      const sortOptions = {};
      if (sort) {
        sortOptions.price = sort === "asc" ? 1 : -1;
      }

      let categories;
      if (query) {
        categories = await categoriesDAO.getCategories(limit, page, {}, filter);
      } else {
        categories = await categoriesDAO.getCategories(limit, page, sortOptions, filter);
      }

      const totalCategories = await categoriesDAO.countCategories(filter);
      const totalPages = Math.ceil(totalCategories / limit);

      const result = {
        status: "success",
        ResultSet: categories,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/api/categories?limit=${limit}&page=${page - 1}` : null,
        nextLink: page < totalPages ? `/api/categories?limit=${limit}&page=${page + 1}` : null,
      };

      return result;
    } catch (error) {
      console.error("Error in /categories route:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }

  async findBySlug(categorySlug) {
    try {
      const category_slug = categorySlug;
      const category = await categoriesDAO.getCategoryBySlug(category_slug);
      return category;
    } catch (error) {
      logger.error("Error getting category by Slug:", error);
      throw error;
    }
  }

  async addCategory(req, res) {
    try {
      const categoryData = req.body;
      categoryData.owner = req.session.user._id;
      const result = await categoriesDAO.addCategory(categoryData);

      if (result.status === "error") {
        return res.status(500).json(result);
      }

      return res.json(result);
    } catch (error) {
      logger.error("Error adding category:", error);
      return res.status(500).json({ error: "Error adding category" });
    }
  }

  async updateCategory(req, res) {
    try {
      const categoryData = req.body;
      if (categoryData["new-parent-id"]) {
        categoryData.parent = categoryData["new-parent-id"];
        delete categoryData["new-parent-id"];
      }
      const result = await categoriesDAO.updateCategory(categoryData);

      if (result.status === "error") {
        return res.status(500).json(result);
      }

      return res.json(result);
    } catch (error) {
      logger.error("Error updating category:", error);
      return res.status(500).json({ error: "Error updating category" });
    }
  }

  async countCategories() {
    try {
      const totalCategories = await Category.countDocuments();
      return totalCategories;
    } catch (error) {
      logger.error("Error counting categories:", error);
      throw error;
    }
  }

  async deleteCategory(req, res) {
    try {
      const categorySlug = req.params.pslug;
      const user = req.session.user;
      const result = await categoriesDAO.deleteCategory(categorySlug, user);
      if (result.error) {
        return res.status(403).json({ error: result.error });
      }
      return res.json(result);
    } catch (error) {
      logger.error("[Controller] Error deleting category:", error);
      return res.status(500).json({ error: "Error deleting category" });
    }
  }
}
