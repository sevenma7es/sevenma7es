import { Router } from "express";
import { logger } from "../../utils/logger.js";
import UserController from "../../controllers/user.controller.js";
import ProductsController from "../../controllers/products.controller.js";
import CategoriesController from "../../controllers/categories.controller.js";
import BuyingOrdersController from "../../controllers/buyingOrders.controller.js";
import InvoicesController from "../../controllers/invoices.controller.js";
import ReceiptsController from "../../controllers/receipts.controller.js";
import EnterpriseController from "../../controllers/enterprise.controller.js";

// Constantes
import { adminSidebarItems, user_context, categories_context, basic_print_edit_delete } from "../../utils/constants.js";

const adminRouter = Router();
const userController = new UserController();
const productsController = new ProductsController();
const categoriesController = new CategoriesController();
const buyingOrdersController = new BuyingOrdersController();
const invoicesController = new InvoicesController();
const receiptsController = new ReceiptsController();
const enterpriseController = new EnterpriseController();

// Middleware for public access
const publicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/admin");
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

adminRouter.get("/", privateAccess, async (req, res) => {
  const raw_enterprise = await enterpriseController.getEnterpriseData();
  let enterprise;
  if (raw_enterprise && raw_enterprise.length > 0) {
    enterprise = raw_enterprise[0].toJSON();
  } else {
    enterprise = null;
  }

  const title = "Inicio";
  const description = `Este es el admin panel de ${enterprise?.name ?? "Empresa"}`;

  res.render("admin/home", {
    isLoggedIn: true,
    adminSidebarItems,
    title,
    description,
    enterprise,
  });
});

adminRouter.get("/register", publicAccess, async (req, res) => {
  const admins = await userController.isThereAnAdmin();
  if (admins.status === "error") {
    res.render("admin/register");
  } else {
    res.render("admin/not-found");
  }
});

adminRouter.get("/login", publicAccess, async (req, res) => {
  try {
    const raw_enterprise = await enterpriseController.getEnterpriseData();
    let enterprise;
    if (raw_enterprise && raw_enterprise.length > 0) {
      enterprise = raw_enterprise[0].toJSON();
    } else {
      enterprise = null;
    }

    const title = "Login";
    const description = `Inicia sesion en el panel administrador de ${enterprise?.name ?? "Empresa"} para comenzar a manejar tu negocio`;
    res.render("admin/login", { isLoggedIn: false, title, description });
  } catch (err) {
    logger.error("Error al obtener datos de la empresa:", err);
    res.status(500).send("Error al obtener datos de la empresa");
  }
});

adminRouter.get("/login-fail", publicAccess, (req, res) => {
  const title = "No Autorizado";
  const description = "Usuario no autorizado en el panel administrador";
  res.render("admin/unauthorized", { title, description });
});

adminRouter.get("/productos", privateAccess, async (req, res) => {
  try {
    const title = "Productos";
    const description = "Visualiza, actualiza o elimina cualquiera de los productos cargados";
    const screen = "products";
    const query = req.query.query || "";
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const response = await productsController.getProducts(req, res, query, limit, page);
    const products = response.ResultSet;

    const totalProducts = await productsController.countProducts();
    const productsPerPage = 10;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const contextMenu = basic_print_edit_delete;

    res.render("admin/products", {
      isLoggedIn: true,
      adminSidebarItems,
      screen,
      contextMenu,
      title,
      description,
      products,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

adminRouter.get("/productos/agregar-producto", privateAccess, async (req, res) => {
  const title = "Agregar Producto";
  const description = "Agrega un producto nuevo a la base de datos";
  const categories = await categoriesController.getAll();
  res.render("admin/add-product", {
    isLoggedIn: true,
    adminSidebarItems,
    title,
    description,
    categories,
  });
});

adminRouter.get("/productos/editar/:pslug", privateAccess, async (req, res) => {
  const title = "Editar Producto";
  const description = "Edita un producto de la base de datos";

  const productData = await productsController.findBySlug(req.params.pslug);
  console.log(JSON.stringify(productData));
  const categories = await categoriesController.getAll();

  console.log("productos: " + productData.description);
  res.render("admin/edit-product", {
    isLoggedIn: true,
    adminSidebarItems,
    title,
    description,
    productData,
    categories,
  });
});

adminRouter.get("/categorias", privateAccess, async (req, res) => {
  try {
    const title = "Categorias";
    const description = "Visualiza, actualiza o elimina cualquiera de las categorias cargadas";
    const screen = "categories";
    const query = req.query.query || "";
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const response = await categoriesController.getCategories(req, res, query, limit, page);
    const categories = response.ResultSet;

    const totalCategories = await categoriesController.countCategories();
    const categoriesPerPage = 10;
    const totalPages = Math.ceil(totalCategories / categoriesPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const contextMenu = categories_context;
    res.render("admin/categories", {
      isLoggedIn: true,
      adminSidebarItems,
      screen,
      contextMenu,
      title,
      description,
      categories,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener categorias:", error);
    res.status(500).send("Error al obtener categorias");
  }
});

adminRouter.get("/categorias/agregar-categoria", privateAccess, async (req, res) => {
  const title = "Agregar Categoría";
  const description = "Agrega una categoría nueva a la base de datos";
  const categories = await categoriesController.getAll();
  res.render("admin/add-category", {
    isLoggedIn: true,
    adminSidebarItems,
    title,
    description,
    categories,
  });
});

adminRouter.get("/categorias/editar/:pslug", privateAccess, async (req, res) => {
  try {
    const title = "Editar Categoría";
    const description = "Edita una categoría de la base de datos";

    const categoryData = await categoriesController.findBySlug(req.params.pslug);

    const properties = categoryData.properties;

    const categories = await categoriesController.getAll();
    res.render("admin/edit-category", {
      isLoggedIn: true,
      adminSidebarItems,
      title,
      description,
      categoryData,
      properties,
      categories,
    });
  } catch (error) {
    logger.error("Error al obtener categoria:", error);
    res.status(500).send("Error al obtener categorias");
  }
});

adminRouter.get("/usuarios", privateAccess, async (req, res) => {
  try {
    const title = "Usuarios";
    const description = "Visualiza, actualiza o elimina usuarios cargados";
    const limit = req.query.limit || 10;
    const response = await userController.getAllUsers(req, res, limit);
    const admins = response.ResultSet;

    const totalAdmins = await userController.countUsers();
    const adminsPerPage = 10;
    const totalPages = Math.ceil(totalAdmins / adminsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const contextMenu = user_context;
    res.render("admin/users", {
      isLoggedIn: true,
      adminSidebarItems,
      contextMenu,
      title,
      description,
      admins,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener usuarios:", error);
    res.status(500).send("Error al obtener usuarios");
  }
});

adminRouter.get("/ordenes-compra", privateAccess, async (req, res) => {
  try {
    const title = "Ordenes de Compra";
    const description = "Visualiza, actualiza o elimina las ordenes de compra cargadas";
    const limit = req.query.limit || 10;
    const response = await buyingOrdersController.getAllBuyingOrders(req, res, limit);
    const buyingOrders = response.ResultSet;
    const totalBuyingOrders = await buyingOrdersController.countBuyingOrders();
    const buyingOrdersPerPage = 10;
    const totalPages = Math.ceil(totalBuyingOrders / buyingOrdersPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const contextMenu = basic_print_edit_delete;

    res.render("admin/buyingOrders", {
      isLoggedIn: true,
      adminSidebarItems,
      contextMenu,
      title,
      description,
      buyingOrders,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener egresos:", error);
    res.status(500).send("Error al obtener egresos");
  }
});

adminRouter.get("/ingresos", privateAccess, async (req, res) => {
  try {
    const title = "Ingresos";
    const description = "Visualiza, actualiza o elimina las facturas de compra cargadas";
    const screen = "invoices";
    const limit = req.query.limit || 10;
    const response = await invoicesController.getAllInvoices(req, res, limit);
    const invoices = response.ResultSet;
    const totalInvoices = await invoicesController.countInvoices();
    const invoicesPerPage = 10;
    const totalPages = Math.ceil(totalInvoices / invoicesPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const contextMenu = basic_print_edit_delete;

    res.render("admin/invoices", {
      isLoggedIn: true,
      adminSidebarItems,
      contextMenu,
      screen,
      title,
      description,
      invoices,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener ingresos:", error);
    res.status(500).send("Error al obtener ingresos");
  }
});

adminRouter.get("/ingresos/imprimir/:id", privateAccess, async (req, res) => {
  try {
    const title = "Imprimir Factura";
    const description = "Imprime una factura de compra";
    const invoiceData = await invoicesController.findById(req.params.id);
    const css = "invoice.css";

    res.render("admin/print-invoice", {
      isLoggedIn: true,
      adminSidebarItems,
      title,
      description,
      css,
      invoiceData,
    });
  } catch (error) {
    logger.error("Error al obtener ingresos:", error);
    res.status(500).send("Error al obtener ingresos");
  }
});

adminRouter.get("/egresos", privateAccess, async (req, res) => {
  try {
    const title = "Egresos";
    const description = "Visualiza, actualiza o elimina las facturas de venta cargadas";
    const limit = req.query.limit || 10;
    const response = await receiptsController.getAllReceipts(req, res, limit);
    const receipts = response.ResultSet;
    const totalReceipts = await receiptsController.countReceipts();
    const receiptsPerPage = 10;
    const totalPages = Math.ceil(totalReceipts / receiptsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const contextMenu = basic_print_edit_delete;

    res.render("admin/receipts", {
      isLoggedIn: true,
      adminSidebarItems,
      contextMenu,
      title,
      description,
      receipts,
      pages,
    });
  } catch (error) {
    logger.error("Error al obtener egresos:", error);
    res.status(500).send("Error al obtener egresos");
  }
});

adminRouter.get("/empresa", privateAccess, async (req, res) => {
  const title = "Empresa";
  const description = "Editar Información de la empresa";

  const data = await enterpriseController.getEnterpriseData();
  // const enterpriseData = data[0].toJSON();

  let enterpriseData;
  if (data && data.length > 0) {
    enterpriseData = data[0].toJSON();
  } else {
    enterpriseData = null;
  }

  res.render("admin/enterprise", {
    isLoggedIn: true,
    adminSidebarItems,
    title,
    description,
    enterpriseData,
  });
});

export default adminRouter;
