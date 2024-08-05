import Enterprise from "../models/enterprise.js";
import { logger } from "../utils/logger.js";

export default class ProductsDAO {
  async getEnterpriseData(limit, page) {
    try {
      const enterprise = await Enterprise.find();
      return enterprise;
    } catch (error) {
      logger.error("Error getting enterprise:", error);
      throw error;
    }
  }

  async addEnterprise(enterprise) {
    try {
      const savedEnterprise = await enterprise.save();
      return savedEnterprise;
    } catch (error) {
      logger.error("Error saving enterprise:", error);
      throw error;
    }
  }

  async updateEnterprise(id, enterpriseData) {
    try {
      const updatedEnterprise = await Enterprise.findByIdAndUpdate(
        id,
        enterpriseData,
        { new: true }
      );

      return updatedEnterprise;
    } catch (error) {
      logger.error("Error updating enterprise:", error);
      throw error;
    }
  }
}
