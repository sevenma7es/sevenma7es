import Settings from "../models/settings.js";
import { logger } from "../utils/logger.js";

export default class SettingsDAO {
  async getSettingsData(limit, page) {
    try {
      const settings = await Settings.find();
      return settings;
    } catch (error) {
      logger.error("Error getting settings:", error);
      throw error;
    }
  }

  async addSettings(settings) {
    try {
      const savedSettings = await settings.save();
      return savedSettings;
    } catch (error) {
      logger.error("Error saving settings:", error);
      throw error;
    }
  }

  async updateSettings(id, settingsData) {
    try {
      const updatedSettings = await Settings.findByIdAndUpdate(id, settingsData, { new: true });

      return updatedSettings;
    } catch (error) {
      logger.error("Error updating settings:", error);
      throw error;
    }
  }
}
