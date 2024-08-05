import { Router } from "express";
import mailerTransport from "../../../config/mailer.config.js";
import { HOST, mailing } from "../../../config/env.js";
import Handlebars from "handlebars";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import EnterpriseController from "../../../controllers/enterprise.controller.js";
import UserController from "../../../controllers/user.controller.js";

const enterpriseController = new EnterpriseController();
const userController = new UserController();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientMailerRouter = Router();

clientMailerRouter.post("/register/:email", async (req, res) => {
  try {
    const destination = req.body.data.email || "";
    let data = req.body.data || "";
    const filePath = path.join(__dirname, "../../../views/client/emails/register.handlebars");
    const templateSource = await readFile(filePath, "utf8");
    const template = Handlebars.compile(templateSource);

    const raw_enterprise = await enterpriseController.getEnterpriseData();
    let enterprise;
    if (raw_enterprise && raw_enterprise.length > 0) {
      enterprise = raw_enterprise[0].toJSON();
      data.enterprise = enterprise;
    } else {
      enterprise = null;
      data.enterprise = enterprise;
    }

    const user = await userController.findByEmail(destination);
    if (user) {
      data.user_id = user._id;
    } else {
      data.user_id = "";
    }

    const html = template(data);
    await mailerTransport.sendMail({
      from: `${data.enterprise ? data.enterprise.name : ""} <${mailing.auth.EMAIL_USER}>`,
      to: destination,
      subject: "Solicitud de registro procesada con éxito",
      html: html,
    });
    res.status(200).json(html);
  } catch (err) {
    console.error("Error leyendo el archivo HTML:", err);
    res.status(500).json({ error: "Error al enviar el correo electrónico" });
  }
});

clientMailerRouter.post("/account/request-reset", async (req, res) => {
  let data = req.body.data || {};
  const destination = data.user.email || "";
  const resetUrl = `${HOST}/recuperar-cuenta/${data.token}`;

  data = {
    ...data,
    resetUrl,
  };

  const raw_enterprise = await enterpriseController.getEnterpriseData();
  let enterprise;
  if (raw_enterprise && raw_enterprise.length > 0) {
    enterprise = raw_enterprise[0].toJSON();
    data.enterprise = enterprise;
  } else {
    enterprise = null;
    data.enterprise = enterprise;
  }

  if (!destination) {
    console.error("No recipients defined");
    return res.status(400).json({ error: "Email recipient not defined" });
  }

  try {
    const filePath = path.join(__dirname, "../../../views/client/emails/request-reset.handlebars");
    const templateSource = await readFile(filePath, "utf8");
    const template = Handlebars.compile(templateSource);
    const html = template(data);

    await mailerTransport.sendMail({
      from: `${data.enterprise ? data.enterprise.name : ""} <${mailing.auth.EMAIL_USER}>`,
      to: destination,
      subject: "Solicitud de cambio de contraseña",
      html: html,
    });

    res.status(200).json(html);
  } catch (err) {
    console.error("Error leyendo el archivo HTML:", err);
    res.status(500).json({ error: "Error al enviar el correo electrónico" });
  }
});

export default clientMailerRouter;
