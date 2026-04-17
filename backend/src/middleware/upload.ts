import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const MAX_VIDEO_MB = parseInt(process.env.MAX_VIDEO_SIZE_MB ?? '500', 10);
const MAX_IMAGE_MB = parseInt(process.env.MAX_IMAGE_SIZE_MB ?? '10', 10);

/**
 * LOCAL DISK STORAGE (for development / when S3 is not configured)
 * Files are saved to backend/uploads/
 */
function localStorage(folder: 'videos' | 'images') {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(__dirname, '../../uploads', folder));
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  });
}

function videoFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowed = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only MP4, MOV, AVI, and WebM videos are allowed'));
  }
}

function imageFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
}

// TODO: swap localStorage() for multerS3() when S3 credentials are ready.
// Example:
//   import multerS3 from 'multer-s3';
//   import { S3Client } from '@aws-sdk/client-s3';
//   const s3 = new S3Client({ region: process.env.S3_REGION, endpoint: process.env.S3_ENDPOINT });
//   multerS3({ s3, bucket: process.env.S3_BUCKET_NAME!, key: (_req, file, cb) => cb(null, `videos/${uuidv4()}`) })

export const videoUpload = multer({
  storage: localStorage('videos'),
  fileFilter: videoFilter,
  limits: { fileSize: MAX_VIDEO_MB * 1024 * 1024 },
});

export const imageUpload = multer({
  storage: localStorage('images'),
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_MB * 1024 * 1024 },
});
