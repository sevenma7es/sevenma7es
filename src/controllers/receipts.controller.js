import ReceiptDAO from "../dao/receipts.dao.js";
import Receipt from "../models/receipt.js";
import { logger } from "../utils/logger.js";

const receiptsDAO = new ReceiptDAO();

export default class ReceiptsController {
  async getAllReceipts(req, res, limit) {
    try {
      const { page = 1, sort, query } = req.query;
      const skip = (page - 1) * limit;

      const filter = {};
      if (query) {
      }

      const sortOptions = {};
      if (sort) {
      }

      const receipts = await receiptsDAO.getAllReceipts(
        limit,
        page,
        sortOptions,
        filter
      );
      //   const sortedUsers = sortUsers(users);
      const totalReceipts = await receiptsDAO.countReceipts(filter);
      const totalPages = Math.ceil(totalReceipts / limit);

      const result = {
        status: "success",
        ResultSet: receipts,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink:
          page > 1 ? `/api/receipts?limit=${limit}&page=${page - 1}` : null,
        nextLink:
          page < totalPages
            ? `/api/receipts?limit=${limit}&page=${page + 1}`
            : null,
      };

      return result;
    } catch (error) {
      console.error("Error in /receipts route:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
  async countReceipts() {
    try {
      const totalReceipts = await receiptsDAO.countReceipts();
      return totalReceipts;
    } catch (error) {
      logger.error("Error counting receipts:", error);
      throw error;
    }
  }
}
