import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "product_images",
    format: async (req, file) => "webp",
    public_id: (req, file) => {
      const originalName = file.originalname.split(".")[0];
      // Reemplaza los espacios con guiones bajos
      const sanitizedFileName = originalName.replace(/\s+/g, "_");
      return `${Date.now()}_${sanitizedFileName}`;
    },
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: fileFilter,
});

const convertAndSave = (req, res, next) => {
  next();
};

export { upload, convertAndSave };
