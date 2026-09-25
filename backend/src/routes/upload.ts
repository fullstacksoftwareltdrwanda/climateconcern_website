import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// Ensure uploads directory exists
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|jfif|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype) || file.mimetype.startsWith('image/');
    if (ext || mime) return cb(null, true);
    cb(new Error('Only image files (JPG, PNG, GIF, WebP, SVG) are allowed'));
  },
});

// Middleware to handle multer single file with error handling
const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  const uploadSingle = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
  ]);

  uploadSingle(req, res, (err: unknown) => {
    if (err) {
      const msg = err instanceof Error ? err.message : 'File upload failed';
      res.status(400).json({ error: msg });
      return;
    }
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const file = files?.image?.[0] || files?.file?.[0] || files?.photo?.[0] || (req as unknown as { file?: Express.Multer.File }).file;
    if (!file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }
    (req as unknown as { uploadedFile: Express.Multer.File }).uploadedFile = file;
    next();
  });
};

const sendUploadResponse = (req: Request, res: Response): void => {
  const file = (req as unknown as { uploadedFile: Express.Multer.File }).uploadedFile;
  const url = `/uploads/${file.filename}`;
  res.json({ url, filename: file.filename, originalName: file.originalname });
};

// Accept both /api/upload/image and /api/upload
router.post('/image', requireAuth, handleUpload, sendUploadResponse);
router.post('/', requireAuth, handleUpload, sendUploadResponse);

export default router;

