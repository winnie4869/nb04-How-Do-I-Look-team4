// import express from 'express';
// import * as rankingController from '../controllers/ranking-controller.js';

// const router = express.Router();
// router.get('/ranking', rankingController.getRanking);

// export default router;
//===================================
// import express from 'express';
// import prisma from '../client/prisma-client.js';

// const router = express.Router();

// /**
//  * @swagger
//  * /ranking:
//  * get:
//  * tags:
//  * - Styles
//  * summary: 스타일 랭킹 목록 조회
//  * description: |
//  * 전체, 트렌디, 개성, 실용성, 가성비 기준으로 스타일 랭킹 목록을 조회합니다.
//  * 'total'은 각 스타일의 큐레이션 점수 평균을 기준으로 순위를 매깁니다.
//  * 이외의 기준(trendy, personality, practicality, costEffectiveness)은 해당 점수의 평균을 기준으로 순위를 매깁니다.
//  * parameters:
//  * - in: query
//  * name: page
//  * schema:
//  * type: integer
//  * default: 1
//  * description: 현재 페이지 번호
//  * - in: query
//  * name: pageSize
//  * schema:
//  * type: integer
//  * default: 10
//  * description: 페이지당 아이템 수
//  * - in: query
//  * name: rankBy
//  * schema:
//  * type: string
//  * enum: [total, trendy, personality, practicality, costEffectiveness]
//  * default: total
//  * description: 랭킹 기준 (total: 전체 평균, trendy: 트렌디, personality: 개성, practicality: 실용성, costEffectiveness: 가성비)
//  * responses:
//  * 200:
//  * description: 조회 성공
//  * content:
//  * application/json:
//  * schema:
//  * type: object
//  * properties:
//  * currentPage:
//  * type: integer
//  * example: 1
//  * totalPages:
//  * type: integer
//  * example: 5
//  * totalItemCount:
//  * type: integer
//  * example: 50
//  * data:
//  * type: array
//  * items:
//  * type: object
//  * properties:
//  * id:
//  * type: integer
//  * example: 1
//  * thumbnail:
//  * type: string
//  * example: "https://example.com/thumbnail.jpg"
//  * nickname:
//  * type: string
//  * example: "스타일러1"
//  * title:
//  * type: string
//  * example: "데일리 캐주얼룩"
//  * tags:
//  * type: array
//  * items:
//  * type: string
//  * example: ["캐주얼", "데일리"]
//  * categories:
//  * type: object
//  * example:
//  * top:
//  * name: "스트라이프 셔츠"
//  * brand: "브랜드A"
//  * price: 50000
//  * viewCount:
//  * type: integer
//  * example: 100
//  * curationCount:
//  * type: integer
//  * example: 20
//  * createdAt:
//  * type: string
//  * format: date-time
//  * example: "2024-02-22T07:47:49.803Z"
//  * ranking:
//  * type: integer
//  * example: 1
//  * rating:
//  * type: number
//  * format: float
//  * example: 4.5
//  * 500:
//  * description: 서버 오류
//  * content:
//  * application/json:
//  * schema:
//  * type: object
//  * properties:
//  * error:
//  * type: string
//  * example: "서버 오류가 발생했습니다."
//  */
// router.get('/ranking', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const rankBy = req.query.rankBy || 'total';
//     const skip = (page - 1) * pageSize;

//     // 모든 큐레이션 데이터를 가져와서 각 스타일의 평균 점수를 계산
//     const curations = await prisma.curation.findMany({
//       select: {
//         styleId: true,
//         trendy: true,
//         personality: true,
//         practicality: true,
//         costEffectiveness: true,
//       },
//     });

//     const styleRatings = {};
//     const styleCurationCounts = {};

//     curations.forEach(curation => {
//       if (!styleRatings[curation.styleId]) {
//         styleRatings[curation.styleId] = {
//           trendy: 0,
//           personality: 0,
//           practicality: 0,
//           costEffectiveness: 0,
//           total: 0,
//         };
//         styleCurationCounts[curation.styleId] = 0;
//       }
      
//       styleRatings[curation.styleId].trendy += curation.trendy;
//       styleRatings[curation.styleId].personality += curation.personality;
//       styleRatings[curation.styleId].practicality += curation.practicality;
//       styleRatings[curation.styleId].costEffectiveness += curation.costEffectiveness;
//       styleCurationCounts[curation.styleId]++;
//     });

//     const rankedStyles = Object.keys(styleRatings).map(styleId => {
//       const counts = styleCurationCounts[styleId];
//       const averages = {
//         id: Number(styleId),
//         trendy: styleRatings[styleId].trendy / counts,
//         personality: styleRatings[styleId].personality / counts,
//         practicality: styleRatings[styleId].practicality / counts,
//         costEffectiveness: styleRatings[styleId].costEffectiveness / counts,
//       };
      
//       averages.total = (averages.trendy + averages.personality + averages.practicality + averages.costEffectiveness) / 4;
//       return averages;
//     });

//     // 랭킹 기준에 따라 정렬
//     const sortedStyles = rankedStyles.sort((a, b) => b[rankBy] - a[rankBy]);

//     // 전체 스타일 수 계산
//     const totalItemCount = sortedStyles.length;
//     const totalPages = Math.ceil(totalItemCount / pageSize);

//     // 페이지네이션 적용
//     const paginatedStyles = sortedStyles.slice(skip, skip + pageSize);
//     const paginatedStyleIds = paginatedStyles.map(style => style.id);

//     // 상세 정보를 포함한 스타일 목록 조회
//     const stylesWithDetails = await prisma.style.findMany({
//       where: {
//         id: {
//           in: paginatedStyleIds,
//         },
//       },
//       include: {
//         tags: {
//           include: {
//             tag: true,
//           },
//         },
//         categories: true,
//       },
//     });

//     // 랭킹과 점수 정보 추가
//     const rankedData = paginatedStyles.map((rankedStyle, index) => {
//       const styleDetail = stylesWithDetails.find(s => s.id === rankedStyle.id);
      
//       // 카테고리 데이터를 요구사항에 맞게 변환
//       const categories = styleDetail.categories.reduce((acc, cat) => {
//         acc[cat.key] = {
//           name: cat.name,
//           brand: cat.brand,
//           price: cat.price,
//         };
//         return acc;
//       }, {});

//       return {
//         id: styleDetail.id,
//         thumbnail: styleDetail.thumbnail,
//         nickname: styleDetail.nickname,
//         title: styleDetail.title,
//         tags: styleDetail.tags.map(t => t.tag.name),
//         categories: categories,
//         viewCount: styleDetail.viewCount,
//         curationCount: styleDetail.curationCount,
//         createdAt: styleDetail.createdAt,
//         ranking: skip + index + 1,
//         rating: parseFloat(rankedStyle[rankBy].toFixed(1)),
//       };
//     }).sort((a, b) => a.ranking - b.ranking); // 순위를 기준으로 다시 정렬하여 정확한 순서 보장

//     res.status(200).json({
//       currentPage: page,
//       totalPages,
//       totalItemCount,
//       data: rankedData,
//     });

//   } catch (error) {
//     console.error('랭킹 조회 중 오류 발생:', error);
//     res.status(500).json({ error: '서버 오류가 발생했습니다.' });
//   }
// });

// export default router;

// ==========================================
import express from 'express';
import prisma from '../client/prisma-client.js';

const router = express.Router();

// 유틸리티 함수들
const validateRankBy = (rankBy) => {
  const validRankBy = ['total', 'trendy', 'personality', 'practicality', 'costEffectiveness'];
  return validRankBy.includes(rankBy) ? rankBy : 'total';
};

const validatePageParams = (page, pageSize) => {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validPageSize = Math.min(100, Math.max(1, parseInt(pageSize) || 10));
  return { validPage, validPageSize };
};

const calculateTotalRating = (trendy, personality, practicality, costEffectiveness) => {
  return (trendy + personality + practicality + costEffectiveness) / 4;
};

const formatCategories = (categories) => {
  return categories.reduce((acc, cat) => {
    acc[cat.key] = {
      name: cat.name,
      brand: cat.brand,
      price: cat.price,
    };
    return acc;
  }, {});
};

const formatStyleData = (style, ranking, rating) => {
  return {
    id: style.id,
    thumbnail: style.thumbnail,
    nickname: style.nickname,
    title: style.title,
    tags: style.tags.map(t => t.tag.name),
    categories: formatCategories(style.categories),
    viewCount: style.viewCount,
    curationCount: style.curationCount,
    createdAt: style.createdAt,
    ranking,
    rating: parseFloat(rating.toFixed(1)),
  };
};

/**
 * @swagger
 * /ranking:
 *   get:
 *     tags:
 *       - Styles
 *     summary: 스타일 랭킹 목록 조회
 *     description: |
 *       전체, 트렌디, 개성, 실용성, 가성비 기준으로 스타일 랭킹 목록을 조회합니다.
 *       'total'은 각 스타일의 큐레이션 점수 평균을 기준으로 순위를 매깁니다.
 *       이외의 기준(trendy, personality, practicality, costEffectiveness)은 해당 점수의 평균을 기준으로 순위를 매깁니다.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 현재 페이지 번호
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 아이템 수 (최대 100)
 *       - in: query
 *         name: rankBy
 *         schema:
 *           type: string
 *           enum: [total, trendy, personality, practicality, costEffectiveness]
 *           default: total
 *         description: 랭킹 기준 (total: 전체 평균, trendy: 트렌디, personality: 개성, practicality: 실용성, costEffectiveness: 가성비)
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalItemCount:
 *                   type: integer
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       thumbnail:
 *                         type: string
 *                         example: "https://example.com/thumbnail.jpg"
 *                       nickname:
 *                         type: string
 *                         example: "스타일러1"
 *                       title:
 *                         type: string
 *                         example: "데일리 캐주얼룩"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["캐주얼", "데일리"]
 *                       categories:
 *                         type: object
 *                         example:
 *                           top:
 *                             name: "스트라이프 셔츠"
 *                             brand: "브랜드A"
 *                             price: 50000
 *                       viewCount:
 *                         type: integer
 *                         example: 100
 *                       curationCount:
 *                         type: integer
 *                         example: 20
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-02-22T07:47:49.803Z"
 *                       ranking:
 *                         type: integer
 *                         example: 1
 *                       rating:
 *                         type: number
 *                         format: float
 *                         example: 4.5
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "잘못된 랭킹 기준입니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 */
router.get('/ranking', async (req, res) => {
  try {
    // 입력 값 검증 및 정규화
    const { validPage: page, validPageSize: pageSize } = validatePageParams(
      req.query.page,
      req.query.pageSize
    );
    const rankBy = validateRankBy(req.query.rankBy);
    
    const skip = (page - 1) * pageSize;

    // 데이터베이스에서 스타일별 큐레이션 평균 점수를 계산
    // groupBy를 사용하여 성능 최적화
    const styleRatings = await prisma.curation.groupBy({
      by: ['styleId'],
      _avg: {
        trendy: true,
        personality: true,
        practicality: true,
        costEffectiveness: true,
      },
      _count: {
        styleId: true,
      },
      // 큐레이션이 있는 스타일만 조회
      having: {
        styleId: {
          gt: 0
        }
      }
    });

    // 큐레이션이 없는 스타일도 포함하기 위해 전체 스타일 수 조회
    const totalStylesCount = await prisma.style.count();

    if (styleRatings.length === 0) {
      return res.status(200).json({
        currentPage: page,
        totalPages: 0,
        totalItemCount: 0,
        data: [],
      });
    }

    // 각 스타일의 점수 계산 및 정렬
    const rankedStyles = styleRatings
      .map(rating => {
        const averages = {
          styleId: rating.styleId,
          trendy: rating._avg.trendy || 0,
          personality: rating._avg.personality || 0,
          practicality: rating._avg.practicality || 0,
          costEffectiveness: rating._avg.costEffectiveness || 0,
          curationCount: rating._count.styleId,
        };
        
        // total 점수는 4개 항목의 평균
        averages.total = calculateTotalRating(
          averages.trendy,
          averages.personality,
          averages.practicality,
          averages.costEffectiveness
        );
        
        return {
          styleId: rating.styleId,
          rating: averages[rankBy],
          averages,
        };
      })
      .sort((a, b) => {
        // 점수가 같으면 큐레이션 수가 많은 순으로 정렬
        if (b.rating === a.rating) {
          return b.averages.curationCount - a.averages.curationCount;
        }
        return b.rating - a.rating;
      });

    // 전체 아이템 수 (랭킹에 포함된 스타일 수)
    const totalItemCount = rankedStyles.length;
    const totalPages = Math.ceil(totalItemCount / pageSize);

    // 현재 페이지가 전체 페이지 수를 초과하는 경우 처리
    if (page > totalPages && totalPages > 0) {
      return res.status(400).json({
        error: `요청한 페이지(${page})가 전체 페이지 수(${totalPages})를 초과합니다.`
      });
    }

    // 페이지네이션 적용
    const paginatedStyles = rankedStyles.slice(skip, skip + pageSize);
    const paginatedStyleIds = paginatedStyles.map(style => style.styleId);

    // 스타일 상세 정보 조회 (단일 쿼리로 최적화)
    const stylesWithDetails = await prisma.style.findMany({
      where: {
        id: {
          in: paginatedStyleIds,
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        categories: {
          orderBy: {
            key: 'asc'
          }
        },
      },
    });

    // 스타일 ID를 키로 하는 맵 생성 (조회 성능 향상)
    const styleMap = new Map(stylesWithDetails.map(style => [style.id, style]));

    // 최종 결과 데이터 구성
    const rankedData = paginatedStyles.map((rankedStyle, index) => {
      const styleDetail = styleMap.get(rankedStyle.styleId);
      
      if (!styleDetail) {
        console.warn(`Style with ID ${rankedStyle.styleId} not found`);
        return null;
      }

      return formatStyleData(
        styleDetail,
        skip + index + 1, // ranking
        rankedStyle.rating
      );
    }).filter(Boolean); // null 값 제거

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalItemCount,
      data: rankedData,
    });

  } catch (error) {
    console.error('랭킹 조회 중 오류 발생:', error);
    
    // 구체적인 에러 타입별 처리
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '요청한 데이터를 찾을 수 없습니다.' });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: '입력 값이 올바르지 않습니다.' });
    }
    
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

export default router;