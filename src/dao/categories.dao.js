import Category from "../models/category.js";
import { logger } from "../utils/logger.js";

export default class CategoriesDAO {
  async getAll() {
    try {
      const categories = await Category.find().lean();
      return categories;
    } catch (error) {
      logger.error("Error al obtener categorias:", error);
      throw error;
    }
  }

  async findBySlug(slug) {
    try {
      const categories = await Category.findOne({ slug: slug }).lean();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  async findSubcategories(categoryId) {
    try {
      const categories = await Category.find({
        $or: [{ _id: categoryId }, { parent: categoryId }],
      }).lean();

      return categories;
    } catch (error) {
      throw error;
    }
  }

  async getCategories(limit, page, sortOptions = {}, filter = {}) {
    try {
      const categories = await Category.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("parent", "name")
        .lean();

      return categories;
    } catch (error) {
      logger.error("Error al obtener categorias:", error);
      throw error;
    }
  }

  async getCategoryBySlug(categorySlug) {
    logger.info("id " + categorySlug);
    try {
      const category = await Category.findOne({ slug: categorySlug }).lean();
      if (category) {
        return category;
      } else {
        logger.error("Categoría no encontrada");
        return null;
      }
    } catch (error) {
      logger.error("Error al obtener la categoría:", error);
      return null;
    }
  }

  async addCategory(categoryData) {
    try {
      if (categoryData.parent === "") {
        categoryData.parent = null;
      }

      const categoryBySlug = await Category.findOne({
        slug: categoryData.slug,
      });

      if (categoryBySlug) {
        return {
          status: "error",
          field: ["slug"],
          message: "Ya existe una categoría con ese slug",
        };
      } else {
        const category = new Category(categoryData);
        await category.save();
        return { status: "Categoría agregada correctamente" };
      }
    } catch (error) {
      logger.error("Error adding the category: ", error);
      return { error: "Error adding the category: " + error };
    }
  }

  async updateCategory(categoryData) {
    try {
      const categoryId = categoryData.id;
      delete categoryData.id;

      if (categoryData.parent === "") {
        categoryData.parent = null;
      }

      const updatedCategory = await Category.findByIdAndUpdate(categoryId, categoryData);

      if (!updatedCategory) {
        return {
          status: "error",
          message: "Categoría no encontrada",
        };
      }

      return {
        status: "categoría actualizada correctamente",
        category: updatedCategory,
      };
    } catch (error) {
      logger.error("Error updating the category: ", error);
      return {
        status: "error",
        message: "Error updating the category: " + error,
      };
    }
  }

  async countCategories(filter) {
    try {
      const count = await Category.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("Error counting categories:", error);
      throw error;
    }
  }

  async deleteCategory(categorySlug, user) {
    try {
      const category = await Category.findOne({ slug: categorySlug });

      if (!category) {
        logger.error("Category not found");
        return { error: "Category not found" };
      }

      if (!user.roles.includes("admin")) {
        return { error: "No tiene permiso para eliminar este categoría" };
      }

      await Category.deleteOne({ slug: categorySlug });
      logger.info("Category successfully deleted");
      return { status: "Categoría eliminada correctamente" };
    } catch (error) {
      logger.error("[DAO] Error deleting category:", error);
      return { error: "Error deleting category" };
    }
  }
}
