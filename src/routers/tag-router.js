import express from 'express';
import prisma from '../client/prisma-client.js';

const router = express.Router();

router.get('/tags', async (req, res) => {
  try {
    // 인기 태그 ID와 개수를 그룹화하여 가져옵니다.
    const popularTags = await prisma.styleTag.groupBy({
      by: ['tagId'],
      _count: {
        tagId: true,
      },
      orderBy: {
        _count: {
          tagId: 'desc',
        },
      },
      take: 5, // 상위 5개 태그만 조회
    });

    // 인기 태그의 ID만 추출합니다.
    const tagIds = popularTags.map(tag => tag.tagId);

    // 추출한 ID를 이용해 태그 이름만 가져옵니다.
    const tags = await prisma.tag.findMany({
      where: {
        id: { in: tagIds },
      },
      // 이름(name) 필드만 선택하여 응답 크기를 최적화합니다.
      select: {
        name: true,
      },
    });

    // tags 배열을 태그 이름만 담은 문자열 배열로 변환합니다.
    const tagNames = tags.map(tag => tag.name);

    // 최종 응답 형식을 { "tags": string[] } 으로 변경하여 반환합니다.
    res.status(200).json({ tags: tagNames });
  } catch (error) {
    console.error('인기 태그 조회 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

export default router;
