import EnterpriseController from "../controllers/enterprise.controller.js";
import SettingsController from "../controllers/settings.controller.js";
import CartController from "../controllers/cart.controller.js";
import UserController from "../controllers/user.controller.js";

const enterpriseController = new EnterpriseController();
const settingsController = new SettingsController();
const cartController = new CartController();
const userController = new UserController();

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

    let user = null;
    if (req.user) {
      user = await userController.findById(req.user._id);
    }

    const sendUser = user ? user.user : null;

    let cartProduct;
    let cartProductQuantity;
    let customDisplay = "hidden";
    if (sendUser) {
      cartProduct = await cartController.getCartByUserId(sendUser._id);

      if (cartProduct) {
        cartProductQuantity = cartProduct.products.length;
      } else {
        cartProductQuantity = 0;
      }

      if (cartProductQuantity > 0) {
        customDisplay = "flex";
      } else {
        customDisplay = "hidden";
      }
    }

    res.locals.layout = "client/main";
    res.locals.enterprise = enterprise;
    res.locals.settings = settings;
    res.locals.user = sendUser;
    res.locals.cartProductQuantity = cartProductQuantity;
    res.locals.customDisplay = customDisplay;
  }
  next();
}
