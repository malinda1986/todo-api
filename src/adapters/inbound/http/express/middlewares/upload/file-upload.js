import multer from 'multer';

// Configure storage (optional, in-memory storage for now)
const storage = multer.memoryStorage();

// Initialize multer middleware
const upload = multer({ storage });

export default upload;
