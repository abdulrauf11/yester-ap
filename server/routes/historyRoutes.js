import express from 'express';
import {
  getGameHistory,
  getGameHistoryDetail,
} from '../controllers/historyController.js';

const router = express.Router();

// For listing all games by userId
router.get('/history/user/:userId', getGameHistory);

// For getting detail of a specific game by gameId
router.get('/history/game/:gameId', getGameHistoryDetail);

export default router;
