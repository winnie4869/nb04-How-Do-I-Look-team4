import prisma from '../client/prisma-client.js';
import { styleSchema, passwordSchema, styleIdSchema } from '../validators/style-validator.js';

/**
 * 새로운 스타일 게시글을 생성하는 서비스 함수
 * @param {object} styleData - 요청 본문 데이터
 * @returns {Promise<object>} 생성된 스타일 데이터
 */
export const createStyleService = async (styleData) => {
  try {
    // Zod를 사용하여 요청 본문 유효성 검사
    const { nickname, title, content, password, categories, tags, imageUrls } = styleSchema.parse(styleData);

    const newStyle = await prisma.$transaction(async (tx) => {
      // Ensure tags is an array
      const validTags = Array.isArray(tags) ? tags : [];

      // Upsert tags to ensure they exist
      const tagRecords = await Promise.all(
        validTags.map(tagName =>
          tx.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          })
        )
      );

      // Create the new style entry
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

      // Link style with tags
      await tx.styleTag.createMany({
        data: tagRecords.map(tag => ({
          styleId: style.id,
          tagId: tag.id,
        })),
      });

      // Fetch the created style with its relations for the final response
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

      // Format the response data
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

      return {
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
    });

    return newStyle;
  } catch (error) {
    if (error instanceof ZodError) {
      // ZodError를 re-throw하여 전역 에러 핸들러에서 처리
      throw error;
    }
    // 기타 에러는 그대로 전파
    throw error;
  }
};

/**
 * 스타일 목록을 조회하는 서비스 함수
 * @param {string} page - 페이지 번호
 * @param {string} pageSize - 페이지 크기
 * @param {string} sortBy - 정렬 기준
 * @param {string} searchBy - 검색 기준
 * @param {string} keyword - 검색 키워드
 * @param {string} tag - 태그
 * @returns {Promise<object>} 스타일 목록 데이터
 */
export const getStylesService = async (page, pageSize, sortBy, searchBy, keyword, tag) => {
  const currentPage = parseInt(page, 10) || 1;
  const itemsPerPage = parseInt(pageSize, 10) || 10;
  
  if (isNaN(currentPage) || isNaN(itemsPerPage) || currentPage <= 0 || itemsPerPage <= 0) {
    const error = new Error('잘못된 요청: 페이지 또는 페이지 크기가 유효하지 않습니다.');
    error.status = 400;
    throw error;
  }

  // Dynamic WHERE condition generation
  const whereCondition = {};
  
  if (tag) {
    whereCondition.tags = {
      some: {
        tag: {
          name: tag,
        },
      },
    };
  }

  if (searchBy && keyword) {
    if (searchBy === 'tag') {
      whereCondition.tags = {
        some: {
          AND: [
            ...(whereCondition.tags?.some?.AND || []),
            {
              tag: {
                name: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
      };
    } else {
      whereCondition[searchBy] = {
        contains: keyword,
        mode: 'insensitive',
      };
    }
  }

  let orderByCondition = {};
  if (sortBy === 'mostViewed') {
    orderByCondition = { viewCount: 'desc' };
  } else if (sortBy === 'mostCurated') {
    orderByCondition = { curationCount: 'desc' };
  } else {
    orderByCondition = { createdAt: 'desc' };
  }

  const totalItemCount = await prisma.style.count({ where: whereCondition });
  const totalPages = Math.ceil(totalItemCount / itemsPerPage);

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

  return {
    currentPage,
    totalPages,
    totalItemCount,
    data: formattedStyles,
  };
};

/**
 * 특정 스타일 게시글의 상세 정보를 조회하는 서비스 함수
 * @param {string} styleId - 스타일 ID
 * @returns {Promise<object>} 스타일 상세 정보
 */
export const getStyleByIdService = async (styleId) => {
  // URL parameter validation
  const { styleId: parsedId } = styleIdSchema.parse({ styleId });

  const style = await prisma.$transaction(async (tx) => {
    // Increment view count
    await tx.style.update({
      where: { id: parsedId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
    
    // Fetch detailed style information
    const styleDetails = await tx.style.findUnique({
      where: { id: parsedId },
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
    const error = new Error('존재하지 않는 스타일 ID입니다.');
    error.status = 404;
    throw error;
  }

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

  return {
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
};

/**
 * 특정 스타일 게시글을 수정하는 서비스 함수
 * @param {string} styleId - 스타일 ID
 * @param {object} updateData - 수정할 데이터
 * @returns {Promise<object>} 수정된 스타일 데이터
 */
export const updateStyleService = async (styleId, updateData) => {
  // URL parameter validation
  const { styleId: parsedId } = styleIdSchema.parse({ styleId });
  // Request body validation
  const { nickname, title, content, password, categories, tags, imageUrls } = styleSchema.parse(updateData);
  
  const existingStyle = await prisma.style.findUnique({
    where: { id: parsedId },
  });

  if (!existingStyle) {
    const error = new Error('존재하지 않는 스타일 ID입니다.');
    error.status = 404;
    throw error;
  }

  if (existingStyle.password !== password) {
    const error = new Error('비밀번호가 틀렸습니다.');
    error.status = 403;
    throw error;
  }

  const updatedStyle = await prisma.$transaction(async (tx) => {
    await tx.image.deleteMany({ where: { styleId: parsedId } });
    await tx.category.deleteMany({ where: { styleId: parsedId } });
    await tx.styleTag.deleteMany({ where: { styleId: parsedId } });

    const tagRecords = await Promise.all(
      tags.map(tagName =>
        tx.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        })
      )
    );

    await tx.image.createMany({
      data: imageUrls.map(url => ({ url, styleId: parsedId })),
    });

    await tx.category.createMany({
      data: Object.entries(categories).map(([key, cat]) => ({
        key,
        name: cat.name,
        brand: cat.brand,
        price: cat.price,
        styleId: parsedId,
      })),
    });

    await tx.styleTag.createMany({
      data: tagRecords.map(tag => ({
        styleId: parsedId,
        tagId: tag.id,
      })),
    });

    const style = await tx.style.update({
      where: { id: parsedId },
      data: {
        nickname,
        title,
        content,
        thumbnail: imageUrls[0],
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

    return {
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
  });

  return updatedStyle;
};

/**
 * 특정 스타일 게시글을 삭제하는 서비스 함수
 * @param {string} styleId - 스타일 ID
 * @param {string} password - 비밀번호
 * @returns {Promise<string>} 성공 메시지
 */
export const deleteStyleService = async (styleId, password) => {
  // URL parameter validation
  const { styleId: parsedId } = styleIdSchema.parse({ styleId });
  // Request body password validation
  const { password: parsedPassword } = passwordSchema.parse({ password });

  const existingStyle = await prisma.style.findUnique({
    where: { id: parsedId },
  });

  if (!existingStyle) {
    const error = new Error('존재하지 않는 스타일 ID입니다.');
    error.status = 404;
    throw error;
  }

  if (existingStyle.password !== parsedPassword) {
    const error = new Error('비밀번호가 틀렸습니다.');
    error.status = 403;
    throw error;
  }

  await prisma.style.delete({
    where: { id: parsedId },
  });

  return '스타일 삭제 성공';
};
