import Product from "../models/product.js";
import Cart from "../models/cart.js";

import { logger } from "../utils/logger.js";

export default class ProductsDAO {
  async getProducts(limit, page, sortOptions = {}, filter = {}) {
    try {
      const products = await Product.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sortOptions)
        .lean();

      return products;
    } catch (error) {
      logger.error("[DAO] Error al obtener productos:", error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await Product.findById(productId).lean();

      if (product) {
        return product;
      } else {
        logger.error("Producto no encontrado");
        return null;
      }
    } catch (error) {
      logger.error("[DAO] Error retrieving product:", error);
      return null;
    }
  }

  async getProductBySlug(productSlug) {
    try {
      const product = await Product.findOne({ slug: productSlug }).populate("category", "name").populate("relatedProducts", "title slug").lean();
      return product;
    } catch (error) {
      logger.error("[DAO] Error retrieving product:", error);
      throw error;
    }
  }

  async getFeaturedProducts() {
    try {
      const product = await Product.find({ featured: true }).lean();
      if (product) {
        return product;
      } else {
        logger.error("Producto no encontrado");
        return null;
      }
    } catch (error) {
      logger.error("[DAO] Error retrieving product:", error);
      return null;
    }
  }

  async addProduct(productData) {
    try {
      if (!productData.owner) {
        productData.owner = "admin";
      }

      const productBySlug = await Product.findOne({ slug: productData.slug });

      if (productBySlug) {
        return {
          status: "error",
          field: ["slug"],
          message: "Ya existe un producto con ese slug",
        };
      } else {
        const product = new Product(productData);
        await product.save();
        return { status: "Producto agregado correctamente" };
      }
    } catch (error) {
      logger.error("[DAO] Error adding product:", error);
      return { error: "[DAO] Error adding product: " + error };
    }
  }

  async getProducts(limit, page, sortOptions = {}, filter = {}) {
    try {
      const products = await Product.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sortOptions)
        .populate("category", "name")
        .lean();

      return products;
    } catch (error) {
      logger.error("[DAO] Error al obtener productos:", error);
      throw error;
    }
  }

  async countProducts(filter = {}) {
    try {
      const count = await Product.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("[DAO] Error al contar productos:", error);
      throw error;
    }
  }

  async updateProduct(productData) {
    try {
      const productId = productData.id;
      delete productData.id;

      const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true, runValidators: true });

      if (!updatedProduct) {
        return {
          status: "error",
          message: "Producto no encontrado",
        };
      }

      return {
        status: "Producto actualizado correctamente",
        product: updatedProduct,
      };
    } catch (error) {
      logger.error("[DAO] Error updating product:", error);
      return { error: "Error updating product: " + error };
    }
  }

  async countProducts(filter) {
    try {
      const count = await Product.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("[DAO] Error contando productos:", error);
      throw error;
    }
  }

  // async deleteProduct(productSlug, user) {
  //   try {
  //     const product = await Product.findOne({ slug: productSlug });

  //     if (!product) {
  //       logger.error("Product not found");
  //       return { error: "Product not found" };
  //     }

  //     if (!user.roles.includes("admin")) {
  //       return { error: "No tiene permiso para eliminar este producto" };
  //     }

  //     await Product.deleteOne({ slug: productSlug });
  //     logger.info("Product successfully deleted");
  //     return { status: "Producto eliminado correctamente" };
  //   } catch (error) {
  //     logger.error("[DAO] Error deleting product:", error);
  //     return { error: "Error deleting product" };
  //   }
  // }
  async deleteProduct(productSlug, user) {
    try {
      const product = await Product.findOne({ slug: productSlug });

      if (!product) {
        logger.error("Product not found");
        return { error: "Product not found" };
      }

      if (!user.roles.includes("admin")) {
        return { error: "No tiene permiso para eliminar este producto" };
      }

      await Product.deleteOne({ slug: productSlug });

      await this.removeProductFromCarts(product._id);

      logger.info("Product successfully deleted");
      return { status: "Producto eliminado correctamente", product };
    } catch (error) {
      logger.error("[DAO] Error deleting product:", error);
      return { error: "Error deleting product" };
    }
  }

  async removeProductFromCarts(productId) {
    try {
      const carts = await Cart.find({ "products.id": productId });

      for (const cart of carts) {
        cart.products = cart.products.filter((product) => product.id.toString() !== productId.toString());
        cart.total = cart.products.reduce((total, product) => total + product.price * product.quantity, 0);
        await cart.save();
      }

      logger.info("Producto eliminado de todos los carritos");
    } catch (error) {
      logger.error("[DAO] Error removing product from carts:", error);
      throw error;
    }
  }
}
