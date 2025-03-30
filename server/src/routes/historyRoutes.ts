import express from 'express';
import { createHistory, createHistoryUsingHistory, createHistoryWithSpecificMember, getMemberHistory } from '../controllers/historyController';

const router = express.Router();

router.post("/", createHistory);
router.post("/member/:memberId", createHistoryWithSpecificMember);
router.get("/member/:memberId/user/:userId", getMemberHistory);
router.post("/:historyId/member/:memberId", createHistoryUsingHistory);

export default router; 
