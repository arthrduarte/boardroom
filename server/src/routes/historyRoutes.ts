import express from 'express';
import { createHistory, createHistoryWithEspecificMember } from '../controllers/historyController';

const router = express.Router();

router.post("/", createHistory);
router.post("/member/:id", createHistoryWithEspecificMember);

export default router; 