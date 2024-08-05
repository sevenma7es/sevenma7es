import { cloudinary_env } from "./env.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: cloudinary_env.CLOUDINARY_ClOUD_NAME,
  api_key: cloudinary_env.CLOUDINARY_API_KEY,
  api_secret: cloudinary_env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
