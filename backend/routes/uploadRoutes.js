// routes/uploadRoutes.js

import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

const port = process.env.PORT || 4000;
const baseURL = process.env.BASE_URL || `http://localhost:${port}`;

// Ensure the upload directory exists
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Helper to configure an uploader route
const getUploader = (folderName, fieldName = 'image') => {
  const dir = `uploads/${folderName}`;
  ensureDirExists(dir);

  const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, dir),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  });

  const upload = multer({ storage }).single(fieldName);

  // Upload endpoint
  router.post(`/${folderName}`, upload, (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const relativePath = `${folderName}/${req.file.filename}`;
    const imageURL = `${baseURL}/uploads/${relativePath}`;

    res.status(200).json({
      success: true,
      message: `${folderName} image uploaded successfully`,
      imagePath: relativePath,
      filePath: relativePath,
      previewURL: imageURL
    });
  });
};

// Register upload routes
getUploader('services', 'file');
getUploader('spareparts', 'file');
getUploader('ecufiles', 'file');
getUploader('avatars', 'file');

export default router;
