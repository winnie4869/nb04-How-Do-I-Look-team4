import prisma from '../client/prisma-client.js';
import { validateRankBy, validatePageParams, calculateTotalRating, formatStyleData } from '../utils/ranking-utils.js';

export const getRankingService = async (page, pageSize, rankBy) => {
  const { validPage: validPage, validPageSize: validPageSize } = validatePageParams(page, pageSize);
  const validatedRankBy = validateRankBy(rankBy);

  const skip = (validPage - 1) * validPageSize;

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

  if (validPage > totalPages && totalPages > 0) {
    const error = new Error(`요청한 페이지(${validPage})가 전체 페이지 수(${totalPages})를 초과합니다.`);
    error.status = 400;
    throw error;
  }


  const paginatedStyles = rankedStyles.slice(skip, skip + validPageSize);
  const paginatedStyleIds = paginatedStyles.map(style => style.styleId);

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
