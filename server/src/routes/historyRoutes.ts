import express from 'express';
import { createHistory, createHistoryWithSpecificMember } from '../controllers/historyController';

const router = express.Router();

router.post("/", createHistory);
router.post("/member/:id", createHistoryWithSpecificMember);

export default router; 