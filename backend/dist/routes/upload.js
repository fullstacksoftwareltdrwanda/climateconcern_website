"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
// Ensure uploads directory exists
const UPLOADS_DIR = path_1.default.resolve(__dirname, '../../uploads');
if (!fs_1.default.existsSync(UPLOADS_DIR)) {
    fs_1.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const base = path_1.default.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        cb(null, `${base}_${Date.now()}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|jfif|svg/;
        const ext = allowed.test(path_1.default.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype) || file.mimetype.startsWith('image/');
        if (ext || mime)
            return cb(null, true);
        cb(new Error('Only image files (JPG, PNG, GIF, WebP, SVG) are allowed'));
    },
});
// Middleware to handle multer single file with error handling
const handleUpload = (req, res, next) => {
    const uploadSingle = upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
    ]);
    uploadSingle(req, res, (err) => {
        if (err) {
            const msg = err instanceof Error ? err.message : 'File upload failed';
            res.status(400).json({ error: msg });
            return;
        }
        const files = req.files;
        const file = files?.image?.[0] || files?.file?.[0] || files?.photo?.[0] || req.file;
        if (!file) {
            res.status(400).json({ error: 'No image file uploaded' });
            return;
        }
        req.uploadedFile = file;
        next();
    });
};
const sendUploadResponse = (req, res) => {
    const file = req.uploadedFile;
    const url = `/uploads/${file.filename}`;
    res.json({ url, filename: file.filename, originalName: file.originalname });
};
// Accept both /api/upload/image and /api/upload
router.post('/image', requireAuth_1.requireAuth, handleUpload, sendUploadResponse);
router.post('/', requireAuth_1.requireAuth, handleUpload, sendUploadResponse);
exports.default = router;
//# sourceMappingURL=upload.js.map