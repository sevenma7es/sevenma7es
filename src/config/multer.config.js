import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "product_images",
    format: async (req, file) => "webp",
    public_id: (req, file) => `${Date.now()}_${file.originalname.split(".")[0]}`,
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/webp") {
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
