import express from 'express';
import RankingController from '../controllers/ranking-controller.js';

const router = express.Router();
const rankingController = new RankingController();

/**
 * @swagger
 * /ranking:
 * get:
 * tags:
 * - Styles
 * summary: 스타일 랭킹 목록 조회
 * description: |
 * 전체, 트렌디, 개성, 실용성, 가성비 기준으로 스타일 랭킹 목록을 조회합니다.
 * 'total'은 각 스타일의 큐레이션 점수 평균을 기준으로 순위를 매깁니다.
 * 이외의 기준(trendy, personality, practicality, costEffectiveness)은 해당 점수의 평균을 기준으로 순위를 매깁니다.
 * parameters:
 * - in: query
 * name: page
 * schema:
 * type: integer
 * default: 1
 * description: 현재 페이지 번호
 * - in: query
 * name: pageSize
 * schema:
 * type: integer
 * default: 10
 * description: 페이지당 아이템 수 (최대 100)
 * - in: query
 * name: rankBy
 * schema:
 * type: string
 * enum: [total, trendy, personality, practicality, costEffectiveness]
 * default: total
 * description: 랭킹 기준 (total: 전체 평균, trendy: 트렌디, personality: 개성, practicality: 실용성, costEffectiveness: 가성비)
 * responses:
 * 200:
 * description: 조회 성공
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * currentPage:
 * type: integer
 * example: 1
 * totalPages:
 * type: integer
 * example: 5
 * totalItemCount:
 * type: integer
 * example: 50
 * data:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * example: 1
 * thumbnail:
 * type: string
 * example: "https://example.com/thumbnail.jpg"
 * nickname:
 * type: string
 * example: "스타일러1"
 * title:
 * type: string
 * example: "데일리 캐주얼룩"
 * tags:
 * type: array
 * items:
 * type: string
 * example: ["캐주얼", "데일리"]
 * categories:
 * type: object
 * example:
 * top:
 * name: "스트라이프 셔츠"
 * brand: "브랜드A"
 * price: 50000
 * viewCount:
 * type: integer
 * example: 100
 * curationCount:
 * type: integer
 * example: 20
 * createdAt:
 * type: string
 * format: date-time
 * example: "2024-02-22T07:47:49.803Z"
 * ranking:
 * type: integer
 * example: 1
 * rating:
 * type: number
 * format: float
 * example: 4.5
 * 400:
 * description: 잘못된 요청
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "잘못된 랭킹 기준입니다."
 * 500:
 * description: 서버 오류
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "서버 오류가 발생했습니다."
 */
router.get('/ranking', rankingController.getRanking);

export default router;
