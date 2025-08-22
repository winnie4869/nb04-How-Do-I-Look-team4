import * as styleService from '../services/style-service.js';

export const getRanking = async (req, res) => {
  console.log("rankingController")
  try {
    const { page = 1, pageSize = 10, rankBy = 'total' } = req.query;

    const rankingData = await styleService.getRankedStyles({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      rankBy
    });

    res.status(200).json(rankingData);
  } catch (error) {
    // 유효하지 않은 rankBy 값이 들어왔을 경우
    if (error.message === 'Invalid rankBy parameter') {
      return res.status(400).json({ message: error.message });
    }
    // 기타 서버 오류
    res.status(500).json({ message: 'Internal Server Error' });
  }
};