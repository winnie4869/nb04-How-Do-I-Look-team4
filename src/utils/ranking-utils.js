// 입력값의 유효성을 검사하고 순위 기준을 반환하는 함수
export const validateRankBy = (rankBy) => {
  const validRankBy = ['total', 'trendy', 'personality', 'practicality', 'costEffectiveness'];
  return validRankBy.includes(rankBy) ? rankBy : 'total';
};

// 페이지네이션 파라미터의 유효성을 검사하고 정규화하는 함수
export const validatePageParams = (page, pageSize) => {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validPageSize = Math.min(100, Math.max(1, parseInt(pageSize) || 10));
  return { validPage, validPageSize };
};

// 4개 항목의 평균 점수를 계산하는 함수
export const calculateTotalRating = (trendy, personality, practicality, costEffectiveness) => {
  return (trendy + personality + practicality + costEffectiveness) / 4;
};

// 카테고리 데이터를 포맷팅하는 함수
export const formatCategories = (categories) => {
  return categories.reduce((acc, cat) => {
    acc[cat.key] = {
      name: cat.name,
      brand: cat.brand,
      price: cat.price,
    };
    return acc;
  }, {});
};

// 스타일 데이터를 최종 응답 형태로 포맷팅하는 함수
export const formatStyleData = (style, ranking, rating) => {
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
