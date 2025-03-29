import express from 'express';
import { createHistory } from '../controllers/historyController';

const router = express.Router();

router.post("/", createHistory);

export default router; 