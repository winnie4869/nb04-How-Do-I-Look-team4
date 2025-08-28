import express from 'express';
import RankingController from '../controllers/ranking-controller.js';

const router = express.Router();
const rankingController = new RankingController();

router.get('/ranking', rankingController.getRanking);

export default router;
