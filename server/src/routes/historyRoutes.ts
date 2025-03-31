import express from 'express';
import { createHistory, createHistoryUsingHistory, createHistoryWithSpecificMember, getMemberHistory, createMessage } from '../controllers/historyController';

const router = express.Router();

router.post("/", createHistory);
router.post("/member/:memberId", createHistoryWithSpecificMember);
router.get("/member/:memberId/user/:userId", getMemberHistory);
router.post("/:historyId/member/:memberId", createHistoryUsingHistory);
router.post("/message", createMessage)

export default router; 
