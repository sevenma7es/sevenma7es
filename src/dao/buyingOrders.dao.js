import BuyingOrder from "../models/buyingOrder.js";
import { logger } from "../utils/logger.js";

export default class BuyingOrdersDAO {
  async getAllBuyingOrders(limit, page, sortOptions = {}, filter = {}) {
    try {
      const buyingOrder = await BuyingOrder.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      return buyingOrder;
    } catch (error) {
      logger.error("Error getting buying orders: ", error);
      throw error;
    }
  }
  async countBuyingOrders(filter) {
    try {
      const count = await BuyingOrder.countDocuments(filter);
      return count;
    } catch (error) {
      logger.error("Error counting buying orders:", error);
      throw error;
    }
  }
}
