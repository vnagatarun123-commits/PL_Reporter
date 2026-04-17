import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getProfile, updateProfile, updateAvatar } from '../controllers/profile.controller';
import { imageUpload } from '../middleware/upload';

const router = Router();

router.use(requireAuth);

router.get('/', getProfile);
router.patch('/', updateProfile);
router.post('/avatar', imageUpload.single('avatar'), updateAvatar);

export default router;
