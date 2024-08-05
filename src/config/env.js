import { config } from "dotenv";
config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ID = process.env.CLIENT_ID;
const CALLBACK_URL = process.env.CALLBACK_URL;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const mailing = {
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_PORT: process.env.EMAIL_PORT,
  auth: {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  },
};
const NODE_ENV = process.env.NODE_ENV;

const JWT_SK = process.env.JWT_SECRET;

const cloudinary_env = {
  CLOUDINARY_ClOUD_NAME: process.env.CLOUDINARY_ClOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_API_ENVIROMENT_VARIABLE: process.env.CLOUDINARY_API_ENVIROMENT_VARIABLE,
};

// const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY;
// const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

export { HOST, PORT, MONGO_PASSWORD, MONGO_URI, CLIENT_ID, CALLBACK_URL, CLIENT_SECRET, mailing, JWT_SK, NODE_ENV, cloudinary_env };
