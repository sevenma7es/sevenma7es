import { Router } from "express";
import { logger } from "../../utils/logger.js";
import ProductsController from "../../controllers/products.controller.js";
import UserController from "../../controllers/user.controller.js";
import CategoriesController from "../../controllers/categories.controller.js";
import EnterpriseController from "../../controllers/enterprise.controller.js";
import SettingsController from "../../controllers/settings.controller.js";

const productsController = new ProductsController();
const userController = new UserController();
const categoriesController = new CategoriesController();
const enterpriseController = new EnterpriseController();
const settingsController = new SettingsController();

// Constantes
import { clientSidebarItems } from "../../utils/constants.js";
import { productsCategories } from "../../public/js/components/products/categories.js";

const clientRouter = Router();

// Middleware for public access
const publicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/");
  next();
};

// Middleware for private access
const privateAccess = async (req, res, next) => {
  if (!req.session.user) {
    const users = await userController.isThereAnAdmin();

    if (users.status == "error") {
      logger.error(users.message);
      return res.redirect("/admin/register");
    } else {
      return res.redirect("/admin/login");
    }
  }
  next();
};

const userMiddleware = (req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
};

clientRouter.get("/", userMiddleware, async (req, res) => {
  try {
    const raw_enterprise = await enterpriseController.getEnterpriseData();
    let enterprise;
    if (raw_enterprise && raw_enterprise.length > 0) {
      enterprise = raw_enterprise[0].toJSON();
    } else {
      enterprise = null;
    }

    const title = "Inicio";
    const description = `Bienvenido a ${enterprise?.name ?? "Empresa"}. Compra mates artesanales y personalizados en nuestra tienda online. Descubre una amplia selección de mates de calabaza, acero, algarrobo y más. Ofrecemos envío rápido, atención al cliente personalizada y productos de alta calidad. ¡Haz tu pedido hoy!`;
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

    const products = await productsController.findByFeatured();
    let user = null;
    if (req.user) {
      user = await userController.findById(req.user._id);
    }

    res.render("client/home", {
      user: user ? user.user : null,
      clientSidebarItems,
      title,
      description,
      products,
      enterprise,
      settings,
    });
  } catch (err) {
    logger.error("Error al cargar la página de inicio:", err);
    res.status(500).send("Error al cargar la página de inicio");
  }
});

clientRouter.get("/productos", userMiddleware, async (req, res) => {
  try {
    const title = "Productos";
    const description = "Listado de todos nuestros productos.";
    const screen = "products";
    const query = req.query.query || "";
    const limit = req.query.limit || 9;
    const page = req.query.page || 1;
    const sort = req.query.sort || null;
    const response = await productsController.getProducts(req, res, query, limit, page, sort);
    const products = response.ResultSet;
    const categories = await categoriesController.getAll();
    const productsCategoriesComponent = productsCategories(categories);
    const categorySelectTitle = "Categoría";
    const totalProducts = await productsController.countProducts();
    const productsPerPage = 9;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    let user = null;
    if (req.user) {
      user = await userController.findById(req.user._id);
    }
    res.render("client/products", {
      user: user ? user.user : null,
      clientSidebarItems,
      title,
      description,
      products,
      productsCategoriesComponent,
      categorySelectTitle,
      pages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/productos?limit=${limit}&page=${page - 1}` : null,
      nextLink: page < totalPages ? `/productos?limit=${limit}&page=${parseInt(page) + 1}` : null,
      sort,
    });
  } catch (error) {
    logger.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

// clientRouter.get("/producto/:pid", (req, res) => {
//   const title = "Producto";
//   const description = "Detalle del producto.";
//   res.render("client/view-product", {
//     title,
//     description,
//   });
// });
clientRouter.get("/producto/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const productController = new ProductsController();
    const product = await productController.findBySlug(slug);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    let user = null;
    if (req.user) {
      user = await userController.findById(req.user._id);
    }

    res.render("client/view-product", {
      user: user ? user.user : null,
      title: product.title,
      description: product.description,
      product,
    });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

clientRouter.get("/nosotros/", (req, res) => {
  const title = "Nosotros";
  const description = "Quienes somos, de donde venimos.";
  res.render("client/about-us", {
    title,
    description,
  });
});

clientRouter.get("/contacto/", (req, res) => {
  const title = "Contactanos";
  const description = "Ponte en contacto con nostros.";
  res.render("client/contact-us", {
    title,
    description,
  });
});

clientRouter.get("/productos/buscar/:keywords", userMiddleware, async (req, res) => {
  try {
    const title = "Productos";
    const description = "Listado de todos nuestros productos.";
    const screen = "products";
    const keywords = req.params.keywords || "";
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort || null;
    const response = await productsController.findByKeywords(req, res, keywords, limit, page, sort);
    const products = response.ResultSet;
    const categories = await categoriesController.getAll();
    const productsCategoriesComponent = productsCategories(categories);
    const categorySelectTitle = "Categoría";
    const totalProducts = await productsController.countProducts();
    const productsPerPage = 10;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    let user = null;
    if (req.user) {
      user = await userController.findById(req.user._id);
    }

    res.render("client/products", {
      user: user ? user.user : null,
      clientSidebarItems,
      title,
      description,
      products,
      productsCategoriesComponent,
      categorySelectTitle,
      pages,
      sort,
    });
  } catch (error) {
    logger.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

clientRouter.get("/productos/categoria/:slug", userMiddleware, async (req, res) => {
  try {
    const title = "Productos";
    const description = "Listado de todos nuestros productos.";
    const screen = "products";
    const slug = req.params.slug || "";
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const response = await productsController.findByCategory(req, res, slug, limit, page);
    const products = response.ResultSet;
    const categories = await categoriesController.getAll();
    const productsCategoriesComponent = productsCategories(categories);
    const categoryBySlug = await categoriesController.findBySlug(slug);
    const categorySelectTitle = categoryBySlug.name;
    const totalProducts = await productsController.countProducts();
    const productsPerPage = 10;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    let user = null;
    if (req.user) {
      user = await userController.findById(req.user._id);
    }
    res.render("client/products", {
      user: user ? user.user : null,
      clientSidebarItems,
      title,
      description,
      products,
      productsCategoriesComponent,
      categoryBySlug,
      categorySelectTitle,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

clientRouter.get("/registro", (req, res) => {
  const title = "Registro";
  const description = "Registrate en nuestra tienda para pasar a ser parte de esta gran familia.";
  res.render("client/register", {
    title,
    description,
    clientSidebarItems,
  });
});

clientRouter.get("/ingresar", (req, res) => {
  const title = "Iniciar sesión";
  const description = "Inicia sesión en tu cuenta para poder manejar tu carrito y finalizar la compra..";
  res.render("client/login", {
    title,
    description,
    clientSidebarItems,
  });
});

clientRouter.get("/recuperar-cuenta", async (req, res) => {
  try {
    const title = "Recuperar Cuenta";
    const description = "Recibe un código de recuperación en tu correo electrónico.";

    const raw_enterprise = await enterpriseController.getEnterpriseData();
    let enterprise;
    if (raw_enterprise && raw_enterprise.length > 0) {
      enterprise = raw_enterprise[0].toJSON();
    } else {
      enterprise = null;
    }

    res.render("client/account-recovery", {
      title,
      description,
      clientSidebarItems,
      enterprise,
    });
  } catch (err) {
    console.error("Error al recuperar los datos de la empresa:", err);
    res.status(500).send("Error al recuperar los datos de la empresa");
  }
});

clientRouter.get("/recuperar-cuenta/:token", async (req, res) => {
  try {
    const title = "Recuperar Cuenta";
    const description = "Recibe un código de recuperación en tu correo electrónico.";
    const token = req.params.token;

    const raw_enterprise = await enterpriseController.getEnterpriseData();
    let enterprise;
    if (raw_enterprise && raw_enterprise.length > 0) {
      enterprise = raw_enterprise[0].toJSON();
    } else {
      enterprise = null;
    }

    res.render("client/new-password", {
      title,
      description,
      clientSidebarItems,
      token,
      enterprise,
    });
  } catch (err) {
    console.error("Error al recuperar los datos de la empresa:", err);
    res.status(500).send("Error al recuperar los datos de la empresa");
  }
});

clientRouter.get("/carrito", async (req, res) => {
  const title = "Carrito";
  const description = "Aquí verás tus productos seleccionados.";
  let user;
  if (req.user) {
    user = await userController.findById(req.user._id);
  }
  res.render("client/cart", {
    user: user ? user.user : null,
    clientSidebarItems,
    title,
    description,
  });
});

clientRouter.get("/usuario/verificar-email/:uid", async (req, res) => {
  try {
    const user_id = req.params.uid;
    await userController.verifyEmail(user_id);
    res.render("client/emails/verified-email");
  } catch (err) {
    res.render("Ocurrió un error inesperado: " + err.message);
  }
});

clientRouter.get("/finalizar-compra", async (req, res) => {
  const title = "Finalizar Compra";
  const description = "Finaliza tu compra de manera segura..";
  let user;
  if (req.user) {
    user = await userController.findById(req.user._id);
  }
  res.render("client/checkout", {
    user: user ? user.user : null,
    clientSidebarItems,
    title,
    description,
  });
});

export default clientRouter;
