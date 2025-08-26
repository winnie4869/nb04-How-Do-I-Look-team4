import prisma from '../client/prisma-client.js';
import { validateRankBy, validatePageParams, calculateTotalRating, formatStyleData } from '../utils/ranking-utils.js';

/**
 * 랭킹 데이터를 조회하고 처리하는 서비스 함수
 * @param {string} page - 페이지 번호
 * @param {string} pageSize - 페이지 크기
 * @param {string} rankBy - 랭킹 기준
 * @returns {Promise<object>} 랭킹 데이터
 */
export const getRankingService = async (page, pageSize, rankBy) => {
  // 입력 값 검증 및 정규화
  const { validPage: validPage, validPageSize: validPageSize } = validatePageParams(page, pageSize);
  const validatedRankBy = validateRankBy(rankBy);
  
  const skip = (validPage - 1) * validPageSize;

  // 데이터베이스에서 스타일별 큐레이션 평균 점수를 계산
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
    having: {
      styleId: {
        gt: 0
      }
    }
  });

  if (styleRatings.length === 0) {
    return {
      currentPage: validPage,
      totalPages: 0,
      totalItemCount: 0,
      data: [],
    };
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
      
      averages.total = calculateTotalRating(
        averages.trendy,
        averages.personality,
        averages.practicality,
        averages.costEffectiveness
      );
      
      return {
        styleId: rating.styleId,
        rating: averages[validatedRankBy],
        averages,
      };
    })
    .sort((a, b) => {
      if (b.rating === a.rating) {
        return b.averages.curationCount - a.averages.curationCount;
      }
      return b.rating - a.rating;
    });

  const totalItemCount = rankedStyles.length;
  const totalPages = Math.ceil(totalItemCount / validPageSize);

  // 현재 페이지가 전체 페이지 수를 초과하는 경우 처리
  if (validPage > totalPages && totalPages > 0) {
    const error = new Error(`요청한 페이지(${validPage})가 전체 페이지 수(${totalPages})를 초과합니다.`);
    error.status = 400;
    throw error;
  }

  // 페이지네이션 적용
  const paginatedStyles = rankedStyles.slice(skip, skip + validPageSize);
  const paginatedStyleIds = paginatedStyles.map(style => style.styleId);

  // 스타일 상세 정보 조회
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

  const styleMap = new Map(stylesWithDetails.map(style => [style.id, style]));

  const rankedData = paginatedStyles.map((rankedStyle, index) => {
    const styleDetail = styleMap.get(rankedStyle.styleId);
    
    if (!styleDetail) {
      console.warn(`Style with ID ${rankedStyle.styleId} not found`);
      return null;
    }

    return formatStyleData(
      styleDetail,
      skip + index + 1,
      rankedStyle.rating
    );
  }).filter(Boolean);

  return {
    currentPage: validPage,
    totalPages,
    totalItemCount,
    data: rankedData,
  };
};
