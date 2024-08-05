import EnterpriseDAO from "../dao/enterprise.dao.js";
import Enterprise from "../models/enterprise.js";
import { logger } from "../utils/logger.js";

const enterpriseDAO = new EnterpriseDAO();

export default class EnterpriseController {
  async getEnterpriseData() {
    try {
      const enterprise = await enterpriseDAO.getEnterpriseData();
      return enterprise;
    } catch (error) {
      logger.error("Error getting enterprise data:", error);
      throw error;
    }
  }

  async addEnterprise(req, res) {
    try {
      const { name, legalName, taxId, address, city, province, country, phone, email, website, logoUrl, foundedYear, businessType, industry, employees, revenue, isVATPayer, vatCategory, description, instagram } = req.body;

      const newEnterprise = new Enterprise({
        name,
        legalName,
        taxId,
        address,
        city,
        province,
        country,
        phone,
        email,
        website,
        logoUrl,
        foundedYear,
        businessType,
        industry,
        employees,
        revenue,
        isVATPayer,
        vatCategory,
        description,
        instagram,
      });

      // Guardar el nuevo registro en la base de datos
      const savedEnterprise = await enterpriseDAO.addEnterprise(newEnterprise);

      res.status(201).json(savedEnterprise);
    } catch (error) {
      logger.error("Error adding enterprise:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateEnterprise(req, res) {
    try {
      const { _id, name, legalName, taxId, address, city, province, country, phone, email, website, logoUrl, foundedYear, businessType, industry, employees, revenue, isVATPayer, vatCategory, description, instagram } = req.body;

      const updatedEnterprise = await enterpriseDAO.updateEnterprise(_id, {
        name,
        legalName,
        taxId,
        address,
        city,
        province,
        country,
        phone,
        email,
        website,
        logoUrl,
        foundedYear,
        businessType,
        industry,
        employees,
        revenue,
        isVATPayer,
        vatCategory,
        description,
        instagram,
      });

      if (!updatedEnterprise) {
        return res.status(404).json({ error: "Enterprise not found" });
      }

      res.status(200).json(updatedEnterprise);
    } catch (error) {
      logger.error("Error updating enterprise:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
