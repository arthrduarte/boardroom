import express from 'express';
import { createHistory, createHistoryWithSpecificMember, getMemberHistory } from '../controllers/historyController';

const router = express.Router();

router.post("/", createHistory);
router.post("/member/:id", createHistoryWithSpecificMember);
router.get("/member/:memberId/user/:userId", getMemberHistory);

export default router; 