import prisma from '../client/prisma-client.js';

export const getRankedStyles = async ({ page, pageSize, rankBy }) => {
  const skip = (page - 1) * pageSize;

  // 랭킹 기준에 따른 정렬 필드 매핑
  const orderByField = getOrderByField(rankBy);
  if (!orderByField) {
    throw new Error('Invalid rankBy parameter');
  }

  // 전체 아이템 수 조회
  const totalItemCount = await prisma.style.count();

  // 랭킹 목록 조회
  const styles = await prisma.style.findMany({
    skip,
    take: pageSize,
    include: {
      tags: {
        select: { tag: { select: { name: true } } }
      },
      categories: true,
      curations: true
    }
  });

  // 데이터 가공 및 rating 계산
  const processedStyles = styles.map(style => {
    // 큐레이팅이 없는 경우 0으로 처리
    if (style.curations.length === 0) {
      return {
        ...style,
        rating: 0
      };
    }

    const totalRatingSum = style.curations.reduce((sum, curation) => {
      let ratingValue;
      if (rankBy === 'trendy') ratingValue = curation.trendy;
      else if (rankBy === 'personality') ratingValue = curation.personality;
      else if (rankBy === 'practicality') ratingValue = curation.practicality;
      else if (rankBy === 'costEffectiveness') ratingValue = curation.costEffectiveness;
      else { // total
        ratingValue = (curation.trendy + curation.personality + curation.practicality + curation.costEffectiveness);
      }
      return sum + ratingValue;
    }, 0);

    const rating = (totalRatingSum / style.curations.length).toFixed(1);
    
    return {
      ...style,
      rating: parseFloat(rating),
      tags: style.tags.map(st => st.tag.name),
      categories: formatCategories(style.categories)
    };
  });
  
  // rating이 높은 순서대로 최종 정렬
  const rankedStyles = processedStyles.sort((a, b) => b.rating - a.rating);

  // 최종 응답 형식에 맞춰 데이터 재구성
  const formattedStyles = rankedStyles.map((style, index) => ({
    id: style.id,
    thumbnail: style.thumbnail,
    nickname: style.nickname,
    title: style.title,
    tags: style.tags,
    categories: style.categories,
    viewCount: style.viewCount,
    curationCount: style.curationCount,
    createdAt: style.createdAt,
    ranking: skip + index + 1,
    rating: style.rating
  }));

  return {
    currentPage: page,
    totalPages: Math.ceil(totalItemCount / pageSize),
    totalItemCount,
    data: formattedStyles,
  };
};

// 헬퍼 함수: 랭킹 기준에 따라 정렬 필드를 결정
const getOrderByField = (rankBy) => {
  if (['total', 'trendy', 'personality', 'practicality', 'costEffectiveness'].includes(rankBy)) {
    return rankBy;
  }
  return null;
};

// 헬퍼 함수: 카테고리 형식 변환
const formatCategories = (categories) => {
  const formatted = {};
  categories.forEach(cat => {
    formatted[cat.key] = {
      name: cat.name,
      brand: cat.brand,
      price: cat.price
    };
  });
  return formatted;
};