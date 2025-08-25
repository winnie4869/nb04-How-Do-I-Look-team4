import { getRankingService } from '../services/ranking-service.js';

class RankingController {
  /**
   * 스타일 랭킹 목록을 조회하고 응답합니다.
   * GET /ranking
   */
  async getRanking(req, res, next) {
    try {
      const { page, pageSize, rankBy } = req.query;
      
      // 비즈니스 로직을 서비스 계층에 위임
      const rankingData = await getRankingService(page, pageSize, rankBy);
      
      res.status(200).json(rankingData);
    } catch (error) {
      // 모든 에러를 에러 핸들러 미들웨어로 전달
      next(error);
    }
  }
}

export default RankingController;
