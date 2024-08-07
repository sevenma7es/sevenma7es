import EnterpriseController from "../controllers/enterprise.controller.js";
import SettingsController from "../controllers/settings.controller.js";

const enterpriseController = new EnterpriseController();
const settingsController = new SettingsController();

export async function setLayout(req, res, next) {
  if (req.path.startsWith("/admin")) {
    const raw_enterprise = await enterpriseController.getEnterpriseData();

    let enterprise;
    if (raw_enterprise && raw_enterprise.length > 0) {
      enterprise = raw_enterprise[0].toJSON();
    } else {
      enterprise = null;
    }

    res.locals.layout = "admin/main";
    res.locals.enterprise = enterprise;
  } else {
    const raw_enterprise = await enterpriseController.getEnterpriseData();
    let enterprise;
    if (raw_enterprise && raw_enterprise.length > 0) {
      enterprise = raw_enterprise[0].toJSON();
    } else {
      enterprise = null;
    }

    const raw_settings = await settingsController.getSettingsData();
    let settings;
    if (raw_settings && raw_settings.length > 0) {
      settings = raw_settings[0].toJSON();
    } else {
      settings = null;
    }

    res.locals.layout = "client/main";
    res.locals.enterprise = enterprise;
    res.locals.settings = settings;
  }
  next();
}
