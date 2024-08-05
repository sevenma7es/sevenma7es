import BuyingOrdersDAO from "../dao/buyingOrders.dao.js";
import BuyingOrder from "../models/buyingOrder.js";
import { logger } from "../utils/logger.js";

const buyingOrdersDAO = new BuyingOrdersDAO();

export default class BuyingOrdersController {
  async getAllBuyingOrders(req, res, limit) {
    try {
      const { page = 1, sort, query } = req.query;
      const skip = (page - 1) * limit;

      const filter = {};
      if (query) {
      }

      const sortOptions = {};
      if (sort) {
      }

      const buyingOrders = await buyingOrdersDAO.getAllBuyingOrders(
        limit,
        page,
        sortOptions,
        filter
      );
      //   const sortedUsers = sortUsers(users);
      const totalBuyingOrders = await buyingOrdersDAO.countBuyingOrders(filter);
      const totalPages = Math.ceil(totalBuyingOrders / limit);

      const result = {
        status: "success",
        ResultSet: buyingOrders,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink:
          page > 1 ? `/api/buyingOrders?limit=${limit}&page=${page - 1}` : null,
        nextLink:
          page < totalPages
            ? `/api/buyingOrders?limit=${limit}&page=${page + 1}`
            : null,
      };

      return result;
    } catch (error) {
      console.error("Error in /buyingOrders route:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
  async countBuyingOrders() {
    try {
      const totalBuyingOrders = await buyingOrdersDAO.countBuyingOrders();
      return totalBuyingOrders;
    } catch (error) {
      logger.error("Error counting buying orders:", error);
      throw error;
    }
  }
}
