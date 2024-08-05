import { Router } from "express";
import CartController from "../../../controllers/cart.controller.js";
import ProductsController from "../../../controllers/products.controller.js";
import { logger } from "../../../utils/logger.js";

const clientCartRouter = Router();
const cartController = new CartController();
const productsController = new ProductsController();

clientCartRouter.get("/:uid", async (req, res) => {
  try {
    const userId = req.params.uid;
    const cart = await cartController.getCartByUserId(userId);
    res.status(200).json(cart);
  } catch (error) {
    logger.error("Error getting cart:", error);
    res.status(500).json({ status: "error", message: "Error getting cart" });
  }
});

clientCartRouter.post("/add-to-cart/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = req.body.quantity;
    let result;

    if (req.session.user) {
      result = await cartController.addProductToCart(req.session.user._id, productId);
      res.json({ result });
    } else {
      const product = await productsController.findById(productId);
      let data = product;
      data.productQuantity = quantity;

      res.status(200).json({
        result: {
          status: "success",
          session: false,
          message: "User not logged in.",
          data: data,
        },
      });
    }
  } catch (error) {
    logger.error("Error adding product to cart:", error);
    res.status(500).json({ status: "error", message: "Error adding product to cart" });
  }
});

clientCartRouter.put("/update-quantity/:productId", async (req, res) => {
  try {
    const result = await cartController.updateProductQuantity(req, res);
    res.json(result);
  } catch (error) {
    logger.error("Error updating product:", error);
    res.status(500).json({ status: "error", message: "Error updating product" });
  }
});

clientCartRouter.put("/remove-product/:productId", async (req, res) => {
  try {
    const result = await cartController.removeProductFromCart(req, res);
    res.json(result);
  } catch (error) {
    logger.error("Error updating product:", error);
    res.status(500).json({ status: "error", message: "Error updating product" });
  }
});

export default clientCartRouter;
