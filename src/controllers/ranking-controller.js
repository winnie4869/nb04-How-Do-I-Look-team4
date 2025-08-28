import { getRankingService } from '../services/ranking-service.js';

class RankingController {
  async getRanking(req, res, next) {
    try {
      const { page, pageSize, rankBy } = req.query;
      const rankingData = await getRankingService(page, pageSize, rankBy);

      res.status(200).json(rankingData);
    } catch (error) {
      next(error);
    }
  }
}

export default RankingController;
