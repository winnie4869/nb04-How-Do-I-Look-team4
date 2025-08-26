import express from 'express';
import prisma from '../client/prisma-client.js';

const router = express.Router();

router.get('/tags', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const popularTags = await prisma.styleTag.groupBy({
      by: ['tagId'],
      _count: { tagId: true },
      orderBy: { _count: { tagId: 'desc' } },
      take: limit,
    });

    const tagIds = popularTags.map(tag => tag.tagId);

    const tags = await prisma.tag.findMany({
      where: { id: { in: tagIds } },
      select: { id: true, name: true },
    });

    // id → name 매핑 후 count까지 포함해서 정렬 보장
    const tagMap = new Map(tags.map(tag => [tag.id, tag.name]));
    const tagResults = popularTags.map(tag => ({
      name: tagMap.get(tag.tagId),
      count: tag._count.tagId,
    }));

    res.status(200).json({ tags: tagResults });
  } catch (error) {
    console.error('인기 태그 조회 중 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

export default router;
