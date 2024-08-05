import express from "express";
import connect from "./db/db_connection.js";
import handlebars from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import initializePassport from "../config/passport.config.js";
import passport from "passport";
import flash from "connect-flash";
import { getPath } from "../utils/functions.js";
import { addLogger } from "../middlewares/addLogger.middleware.js";
import { PORT, MONGO_URI } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { setLayout } from "../middlewares/setLayout.middleware.js";
import hbs from "../config/handlebars.config.js";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import cors from "cors";
import compression from "compression";

// Admin routes
import adminRouter from "../routes/admin/admin.router.js";
import adminSessionRouter from "../routes/api/admin/session.router.js";
import adminProductsRouter from "../routes/api/admin/products.router.js";
import adminUserRouter from "../routes/api/admin/user.router.js";
import adminEnterpriseRouter from "../routes/api/admin/enterprise.router.js";
import adminInvoicesRouter from "../routes/api/admin/invoices.router.js";
import adminCategoriesRouter from "../routes/api/admin/categories.router.js";

// Client routes
import clientRouter from "../routes/client/client.router.js";
import clientSessionRouter from "../routes/api/client/session.router.js";
import clientCartRouter from "../routes/api/client/carts.router.js";
import clientProductsRouter from "../routes/api/client/products.router.js";
import clientMailerRouter from "../routes/api/client/emails.router.js";
import clientPaymentsRouter from "../routes/api/client/payments.router.js";
import clientEnterpriseRouter from "../routes/api/client/enterprise.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Iniciar express
const app = express();

// MongoDB connection
connect();

// Session middleware
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: "ourSecret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
    }),
  })
);
app.use(flash());

app.use(compression());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Passport initialization
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));

const viewsPath = path.resolve(__dirname, "../views");
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", viewsPath);

app.use(setLayout);

// Routes
app.use("/api/admin/sessions", adminSessionRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/categories", adminCategoriesRouter);
app.use("/api/admin/users", adminUserRouter);
app.use("/api/admin/enterprise", adminEnterpriseRouter);
app.use("/api/admin/invoices", adminInvoicesRouter);
app.use("/api/client/sessions", clientSessionRouter);
app.use("/api/client/products", clientProductsRouter);
app.use("/api/client/carts", clientCartRouter);
app.use("/api/client/mailer", clientMailerRouter);
app.use("/api/client/payments", clientPaymentsRouter);
app.use("/api/client/enterprise", clientEnterpriseRouter);
app.use("/admin", adminRouter);
app.use("/", clientRouter);

app.listen(PORT, () => {
  logger.info(chalk.blue(`Server running http://localhost:${PORT}/`));
});
