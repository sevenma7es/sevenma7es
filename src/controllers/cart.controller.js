import CartsDAO from "../dao/carts.dao.js";
import ProductsDAO from "../dao/products.dao.js";
import UserDAO from "../dao/user.dao.js";
import Cart from "../models/cart.js";
import { logger } from "../utils/logger.js";

export default class CartController {
  constructor() {
    this.productDAO = new ProductsDAO();
    this.cartDAO = new CartsDAO();
    this.userDAO = new UserDAO();
    // this.ticketDAO = new TicketDAO();
  }

  // Crea un nuevo carrito
  async createCart(req, res) {
    try {
      const { products } = req.body;
      const newCart = await this.cartDAO.createCart(products);

      return { cart: newCart, session: true };
    } catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  }

  // Obtiene un carrito por su ID
  async getCartById(paramcartId) {
    try {
      const cartId = paramcartId;
      const cart = await this.cartDAO.getCartById(cartId);
      return cart;
    } catch (error) {
      console.error("Error getting cart by ID:", error);
      throw error;
    }
  }

  async getCartByUserId(userId) {
    try {
      const cart = await this.cartDAO.getCartByUserId(userId);
      return cart;
    } catch (error) {
      console.error("Error getting cart by ID:", error);
      throw error;
    }
  }

  // Añade un producto al carrito de un usuario
  async addProductToCart(userId, productId) {
    try {
      // Buscar el carrito del usuario
      const cart = await this.cartDAO.getCartByUserId(userId);

      if (!cart) {
        // Si el usuario no tiene un carrito, crear uno nuevo
        const newCart = await this.cartDAO.createCart(userId, productId);
        return { newCart, session: true };
      }

      // Agregar el producto al carrito del usuario
      const result = await this.cartDAO.addProductToCart(cart._id, productId);

      if (result && result.error) {
        return { error: result.error };
      }

      return { result, session: true };
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Actualiza la cantidad de un producto en el carrito
  async updateProductQuantity(req, res) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const { _id } = req.session.user;
      const result = await this.cartDAO.updateProductQuantity(_id, productId, quantity);

      return { result, session: true };
    } catch (error) {
      console.error("Error updating product quantity:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Elimina un producto del carrito
  async removeProductFromCart(req, res) {
    try {
      const { productId } = req.params;
      const { _id } = req.session.user;
      const result = await this.cartDAO.removeProductFromCart(_id, productId);

      return { result, session: true };
    } catch (error) {
      console.error("Error removing product from cart:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Obtiene un carrito por su ID
  //   async purchaseCart(cartId) {
  //     try {
  //       const cart = await this.cartDAO.getCartById(cartId);
  //       const user = await this.userDAO.getUserById(cart.user);

  //       if (!cart) {
  //         console.error("Cart not found");
  //         return { error: "Cart not found" };
  //       }
  //       const ticket = await this.ticketDAO.createTicket(cart, user);
  //       await this.cartDAO.emptyCart(cartId);

  //       return ticket;
  //     } catch (error) {
  //       console.error("Error purchasing cart:", error);
  //       throw error;
  //     }
  //   }
}
