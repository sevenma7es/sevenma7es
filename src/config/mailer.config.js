import nodemailer from "nodemailer";
import { mailing } from "./env.js";

const mailerTransport = nodemailer.createTransport({
  service: mailing.EMAIL_SERVICE,
  port: mailing.EMAIL_PORT,
  auth: {
    user: mailing.auth.EMAIL_USER,
    pass: mailing.auth.EMAIL_PASSWORD,
  },
});

export default mailerTransport;
