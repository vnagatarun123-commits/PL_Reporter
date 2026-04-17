import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  listVideos,
  getVideo,
  createVideo,
  updateVideo,
  submitVideo,
  deleteVideo,
  reportVideo,
} from '../controllers/video.controller';
import { videoUpload } from '../middleware/upload';

const router = Router();

router.use(requireAuth);

router.get('/', listVideos);
router.get('/:id', getVideo);
router.post('/', videoUpload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), createVideo);
router.patch('/:id', updateVideo);
router.post('/:id/submit', submitVideo);
router.delete('/:id', deleteVideo);
router.post('/:id/report', reportVideo);

export default router;
