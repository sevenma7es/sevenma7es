import InvoicesDAO from "../dao/invoices.dao.js";
import Invoice from "../models/invoice.js";
import { logger } from "../utils/logger.js";

const invoicesDAO = new InvoicesDAO();

export default class InvoicesController {
  async getAllInvoices(req, res, limit) {
    try {
      const { page = 1, sort, query } = req.query;
      const skip = (page - 1) * limit;

      const filter = {};
      if (query) {
      }

      const sortOptions = {};
      if (sort) {
      }

      const invoices = await invoicesDAO.getAllInvoices(
        limit,
        page,
        sortOptions,
        filter
      );
      //   const sortedUsers = sortUsers(users);
      const totalInvoices = await invoicesDAO.countInvoices(filter);
      const totalPages = Math.ceil(totalInvoices / limit);

      const result = {
        status: "success",
        ResultSet: invoices,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink:
          page > 1 ? `/api/invoices?limit=${limit}&page=${page - 1}` : null,
        nextLink:
          page < totalPages
            ? `/api/invoices?limit=${limit}&page=${page + 1}`
            : null,
      };

      return result;
    } catch (error) {
      console.error("Error in /invoices route:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  async findById(invoiceId) {
    try {
      const id = invoiceId;
      const invoice = await invoicesDAO.findById(id);
      return invoice;
    } catch (error) {
      logger.error("Error getting invoice by ID:", error);
      throw error;
    }
  }
  async countInvoices() {
    try {
      const totalInvoices = await invoicesDAO.countInvoices();
      return totalInvoices;
    } catch (error) {
      logger.error("Error counting invoices:", error);
      throw error;
    }
  }

  async getTotalInvoicesByMonth(req, res) {
    try {
      const data = await invoicesDAO.getTotalInvoicesByMonth();
      // res.json(stats);
      return { data };
    } catch (error) {
      logger.error("Error getting the total invoices by month:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  async getTotalAmountByMonth(req, res) {
    try {
      const data = await invoicesDAO.getTotalAmountByMonth();
      // res.json(stats);
      return { data };
    } catch (error) {
      logger.error("Error getting the total amount by month:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  async getInvoicesByType(req, res) {
    try {
      const data = await invoicesDAO.getInvoicesByType();
      // res.json(stats);
      return { data };
    } catch (error) {
      logger.error("Error getting invoices by type:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
}
