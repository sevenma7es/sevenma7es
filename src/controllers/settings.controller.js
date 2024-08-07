import SettingsDAO from "../dao/settings.dao.js";
import Settings from "../models/settings.js";
import { logger } from "../utils/logger.js";

const settingsDAO = new SettingsDAO();

export default class SettingsController {
  async getSettingsData() {
    try {
      const settings = await settingsDAO.getSettingsData();
      return settings;
    } catch (error) {
      logger.error("Error getting settings data:", error);
      throw error;
    }
  }

  async addSettings(req, res) {
    try {
      const { main_footer_copyright, home_kicker, home_title, home_title2, home_subtitle, home_section1, home_section2 } = req.body;

      const newSettings = new Settings({
        main_footer_copyright,
        home_kicker,
        home_title,
        home_title2,
        home_subtitle,
        home_section1,
        home_section2,
      });

      const savedSettings = await settingsDAO.addSettings(newSettings);

      res.status(201).json(savedSettings);
    } catch (error) {
      logger.error("Error adding settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateSettings(req, res) {
    try {
      const { _id, main_footer_copyright, home_kicker, home_title, home_title2, home_subtitle, home_section1, home_section2 } = req.body;

      const updatedSettings = await settingsDAO.updateSettings(_id, {
        main_footer_copyright,
        home_kicker,
        home_title,
        home_title2,
        home_subtitle,
        home_section1,
        home_section2,
      });

      if (!updatedSettings) {
        return res.status(404).json({ error: "Settings not found" });
      }

      res.status(200).json(updatedSettings);
    } catch (error) {
      logger.error("Error updating settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
