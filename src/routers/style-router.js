import express from 'express';
import prisma from '../client/prisma-client.js';

const router = express.Router();

router.post('/styles', async (req, res) => {
  const { nickname, title, content, password, categories, tags, imageUrls } = req.body;

  try {
    if (!nickname || !title || !content || !password || !categories || !tags || !imageUrls || imageUrls.length === 0) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    const newStyle = await prisma.$transaction(async (tx) => {
      const tagRecords = await Promise.all(
        tags.map(tagName =>
          tx.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          })
        )
      );

      const style = await tx.style.create({
        data: {
          nickname,
          title,
          content,
          password,
          thumbnail: imageUrls[0],
          
          images: {
            create: imageUrls.map(url => ({ url })),
          },
          
          categories: {
            create: Object.entries(categories).map(([key, cat]) => ({
              key,
              name: cat.name,
              brand: cat.brand,
              price: cat.price,
            })),
          },
        },
      });

      await tx.styleTag.createMany({
        data: tagRecords.map(tag => ({
          styleId: style.id,
          tagId: tag.id,
        })),
      });

      const createdStyleWithRelations = await tx.style.findUnique({
        where: { id: style.id },
        include: {
          images: true,
          categories: true,
          tags: {
            select: {
              tag: true,
            },
          },
        },
      });

      const formattedCategories = createdStyleWithRelations.categories.reduce((acc, cat) => {
        acc[cat.key] = {
          name: cat.name,
          brand: cat.brand,
          price: cat.price,
        };
        return acc;
      }, {});

      const formattedTags = createdStyleWithRelations.tags.map(styleTag => styleTag.tag.name);
      
      const formattedImageUrls = createdStyleWithRelations.images.map(image => image.url);

      const formattedResponse = {
        id: createdStyleWithRelations.id,
        nickname: createdStyleWithRelations.nickname,
        title: createdStyleWithRelations.title,
        content: createdStyleWithRelations.content,
        viewCount: createdStyleWithRelations.viewCount,
        curationCount: createdStyleWithRelations.curationCount,
        createdAt: createdStyleWithRelations.createdAt,
        categories: formattedCategories,
        tags: formattedTags,
        imageUrls: formattedImageUrls,
      };

      return formattedResponse;
    });

    res.status(201).json(newStyle);
  } catch (error) {
    console.error('스타일 게시글 생성 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

router.get('/styles', async (req, res) => {
  try {
    const { page, pageSize, sortBy, searchBy, keyword, tag } = req.query;

    // 파라미터 유효성 검사
    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(pageSize, 10) || 10;
    if (isNaN(currentPage) || isNaN(itemsPerPage) || currentPage <= 0 || itemsPerPage <= 0) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 쿼리 조건 설정
    const whereCondition = {};
    if (tag) {
      whereCondition.tags = {
        some: {
          tag: {
            name: tag,
          },
        },
      };
    } else if (searchBy && keyword) {
      if (searchBy === 'tag') {
        whereCondition.tags = {
          some: {
            tag: {
              name: {
                contains: keyword,
                mode: 'insensitive', // 대소문자 구분 없이 검색
              },
            },
          },
        };
      } else {
        whereCondition[searchBy] = {
          contains: keyword,
          mode: 'insensitive',
        };
      }
    }

    // 정렬 조건 설정
    let orderByCondition = {};
    if (sortBy === 'mostViewed') {
      orderByCondition = { viewCount: 'desc' };
    } else if (sortBy === 'mostCurated') {
      orderByCondition = { curationCount: 'desc' };
    } else { // 기본값: 최신순
      orderByCondition = { createdAt: 'desc' };
    }

    // 페이지네이션을 위한 총 아이템 수 조회
    const totalItemCount = await prisma.style.count({ where: whereCondition });
    const totalPages = Math.ceil(totalItemCount / itemsPerPage);

    // 스타일 목록 조회
    const styles = await prisma.style.findMany({
      where: whereCondition,
      orderBy: orderByCondition,
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      include: {
        images: true,
        categories: true,
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });

    // 응답 형식에 맞춰 데이터 가공
    const formattedStyles = styles.map(style => {
      const formattedCategories = style.categories.reduce((acc, cat) => {
        acc[cat.key] = {
          name: cat.name,
          brand: cat.brand,
          price: cat.price,
        };
        return acc;
      }, {});

      const formattedTags = style.tags.map(styleTag => styleTag.tag.name);
      
      return {
        id: style.id,
        thumbnail: style.thumbnail,
        nickname: style.nickname,
        title: style.title,
        tags: formattedTags,
        categories: formattedCategories,
        content: style.content,
        viewCount: style.viewCount,
        curationCount: style.curationCount,
        createdAt: style.createdAt,
      };
    });

    res.status(200).json({
      currentPage,
      totalPages,
      totalItemCount,
      data: formattedStyles,
    });

  } catch (error) {
    console.error('스타일 목록 조회 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

<<<<<<< HEAD
<<<<<<< HEAD
=======
router.get('/styles/:styleId', async (req, res) => {
  const { styleId } = req.params;

  try {
    const numericStyleId = Number(styleId);

    // styleId가 유효한 숫자인지 확인
    if (isNaN(numericStyleId) || numericStyleId <= 0) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 트랜잭션을 사용하여 조회수 증가와 데이터 조회 작업을 원자적으로 처리
    const style = await prisma.$transaction(async (tx) => {
      // 조회수 1 증가
      await tx.style.update({
        where: { id: numericStyleId },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
      
      // 상세 정보 조회
      const styleDetails = await tx.style.findUnique({
        where: { id: numericStyleId },
        include: {
          images: true,
          categories: true,
          tags: {
            select: {
              tag: true,
            },
          },
        },
      });

      return styleDetails;
    });

    if (!style) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 응답 형식에 맞춰 데이터 가공
    const formattedCategories = style.categories.reduce((acc, cat) => {
      acc[cat.key] = {
        name: cat.name,
        brand: cat.brand,
        price: cat.price,
      };
      return acc;
    }, {});

    const formattedTags = style.tags.map(styleTag => styleTag.tag.name);
    const formattedImageUrls = style.images.map(image => image.url);

    const formattedResponse = {
      id: style.id,
      nickname: style.nickname,
      title: style.title,
      content: style.content,
      viewCount: style.viewCount,
      curationCount: style.curationCount,
      createdAt: style.createdAt,
      categories: formattedCategories,
      tags: formattedTags,
      imageUrls: formattedImageUrls,
    };

    res.status(200).json(formattedResponse);

  } catch (error) {
    console.error('스타일 게시글 상세 조회 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

>>>>>>> b41f66e (1)
=======
>>>>>>> 969ac04 (IDK)
router.put('/styles/:styleId', async (req, res) => {
  const { styleId } = req.params;
  const { nickname, title, content, password, categories, tags, imageUrls } = req.body;

  try {
    // 1. 필수 필드 유효성 검사
    if (!nickname || !title || !content || !password || !categories || !tags || !imageUrls || imageUrls.length === 0) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 2. 게시글 존재 여부 및 비밀번호 확인
    const existingStyle = await prisma.style.findUnique({
      where: { id: Number(styleId) },
    });

    if (!existingStyle) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    if (existingStyle.password !== password) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    // 3. 트랜잭션을 사용하여 모든 업데이트 작업 처리
    const updatedStyle = await prisma.$transaction(async (tx) => {
      // 기존 관계 데이터 삭제
      await tx.image.deleteMany({ where: { styleId: Number(styleId) } });
      await tx.category.deleteMany({ where: { styleId: Number(styleId) } });
      await tx.styleTag.deleteMany({ where: { styleId: Number(styleId) } });

      // Tags 테이블에 태그를 생성하거나 찾기
      const tagRecords = await Promise.all(
        tags.map(tagName =>
          tx.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          })
        )
      );

      // 새로운 관계 데이터 생성
      await tx.image.createMany({
        data: imageUrls.map(url => ({ url, styleId: Number(styleId) })),
      });

      await tx.category.createMany({
        data: Object.entries(categories).map(([key, cat]) => ({
          key,
          name: cat.name,
          brand: cat.brand,
          price: cat.price,
          styleId: Number(styleId),
        })),
      });

      await tx.styleTag.createMany({
        data: tagRecords.map(tag => ({
          styleId: Number(styleId),
          tagId: tag.id,
        })),
      });

      // 스타일 게시글 본문 업데이트
      const style = await tx.style.update({
        where: { id: Number(styleId) },
        data: {
          nickname,
          title,
          content,
          thumbnail: imageUrls[0], // 썸네일도 첫 번째 이미지로 업데이트
        },
        include: {
          images: true,
          categories: true,
          tags: {
            select: {
              tag: true,
            },
          },
        },
      });

      // 클라이언트 응답 형식에 맞게 데이터 가공
      const formattedCategories = style.categories.reduce((acc, cat) => {
        acc[cat.key] = {
          name: cat.name,
          brand: cat.brand,
          price: cat.price,
        };
        return acc;
      }, {});

      const formattedTags = style.tags.map(styleTag => styleTag.tag.name);
      
      const formattedImageUrls = style.images.map(image => image.url);

      const formattedResponse = {
        id: style.id,
        nickname: style.nickname,
        title: style.title,
        content: style.content,
        viewCount: style.viewCount,
        curationCount: style.curationCount,
        createdAt: style.createdAt,
        categories: formattedCategories,
        tags: formattedTags,
        imageUrls: formattedImageUrls,
      };

      return formattedResponse;
    });

    res.status(200).json(updatedStyle);
  } catch (error) {
    console.error('스타일 게시글 수정 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 969ac04 (IDK)
router.get('/styles/popular-tags', async (req, res) => {
  try {
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
      take: 10, // 상위 10개 태그만 조회
    });

    // 태그 이름을 가져오기 위해 조인 또는 별도 쿼리 실행
    const tagIds = popularTags.map(tag => tag.tagId);
    const tags = await prisma.tag.findMany({
      where: {
        id: { in: tagIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // 태그 이름과 카운트를 병합
    const formattedPopularTags = popularTags.map(popularTag => {
      const tagInfo = tags.find(tag => tag.id === popularTag.tagId);
      return {
        name: tagInfo ? tagInfo.name : 'Unknown',
        count: popularTag._count.tagId,
      };
    });

    res.status(200).json(formattedPopularTags);
  } catch (error) {
    console.error('인기 태그 조회 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

<<<<<<< HEAD
=======
>>>>>>> b41f66e (1)
=======
>>>>>>> 969ac04 (IDK)
router.delete('/styles/:styleId', async (req, res) => {
  const { styleId } = req.params;
  const { password } = req.body;

  try {
    // 1. 필수 필드 유효성 검사
    if (!password) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 2. 게시글 존재 여부 및 비밀번호 확인
    const existingStyle = await prisma.style.findUnique({
      where: { id: Number(styleId) },
    });

    if (!existingStyle) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    if (existingStyle.password !== password) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    // 3. 스타일 및 연관 데이터 삭제
    // onDelete: Cascade 옵션을 통해 style 삭제 시 연관된 image, category, styleTag가 자동으로 삭제되도록 할 수 있지만,
    // 현재는 명시적으로 모든 것을 삭제하여 명확성을 높입니다.
    await prisma.$transaction(async (tx) => {
      await tx.image.deleteMany({ where: { styleId: Number(styleId) } });
      await tx.category.deleteMany({ where: { styleId: Number(styleId) } });
      await tx.styleTag.deleteMany({ where: { styleId: Number(styleId) } });
      await tx.style.delete({ where: { id: Number(styleId) } });
    });

    res.status(200).json({ message: '스타일 삭제 성공' });
  } catch (error) {
    console.error('스타일 게시글 삭제 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> b41f66e (1)
=======

>>>>>>> 969ac04 (IDK)
export default router;
