import express from 'express';
import { getPictures } from '../controllers/picturesController';

const router = express.Router();

router.get('/', getPictures);

export default router; 