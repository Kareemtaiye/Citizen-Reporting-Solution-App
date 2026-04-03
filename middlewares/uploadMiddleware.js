/**
 * uploadMiddleware.js
 * Multer configuration for local disk storage.
 * Saves uploaded images to uploads/reports/.
 * Limits: 5MB per file, max 5 files per request, JPEG/PNG/WEBP/GIF only.
 */

import multer from "multer";
import path from "path";
import fs from "fs";
import AppError from "../utilities/AppError.js";

// Create the upload directory if it doesn't exist
const UPLOAD_DIR = "uploads/reports";
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only JPEG, PNG, WEBP, and GIF images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

export const uploadReportImages = upload.array("images", 5);
