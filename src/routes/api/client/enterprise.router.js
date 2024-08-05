import { Router } from "express";
import EnterpriseController from "../../../controllers/enterprise.controller.js";
import { logger } from "../../../utils/logger.js";

const clientEnterpriseRouter = Router();
const enterpriseController = new EnterpriseController();

clientEnterpriseRouter.get("/enterprise-info", async (req, res) => {
  try {
    const enterprise = await enterpriseController.getEnterpriseData();
    res.status(200).json(enterprise);
  } catch (error) {
    logger.error("Error getting enterprise:", error);
    res.status(500).json({ status: "error", message: "Error getting enterprise" });
  }
});

export default clientEnterpriseRouter;
