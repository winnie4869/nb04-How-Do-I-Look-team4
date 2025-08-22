import prisma from "../client/prisma-client.js";

export const getCuration = async (styleId) => {
  if (isNaN(styleId)) {
      const err = new Error("잘못된 요청입니다");
      err.status = 400;
      throw err;
  }
  
  return await prisma.style.findUnique({
    where: { id: styleId },
    include: {
      curations: true,   
      _count: { select: { curations: true } } 
    }
  });
};


export const postCuration = async (styleId, { nickname, content, password, trendy, personality, practicality, costEffectiveness } ) => {

  const postedCuration = await prisma.curation.create({
      data: {
        styleId,
        nickname,
        content,
        password,
        trendy,
        personality,
        practicality,
        costEffectiveness
    },
  });
  
  const styleWithCurations = await prisma.style.findUnique({
    where: { id: styleId },
    include: { curations: true }
  });
  return styleWithCurations.curations;
};

export const putCuration = async (curationId, { password, nickname, content, trendy, personality, practicality, costEffectiveness}) => {
  
  if (isNaN(curationId)) {
    const err = new Error("잘못된 요청입니다");
    err.status = 400;
    throw err;
  }
  
  const existingCuration = await prisma.curation.findUnique({
    where: { id: curationId }
  });
  
  
  if (!existingCuration) {
    const err = new Error("존재하지 않습니다");
    err.status = 404;
    throw err;
  }

  
  const effectivePassword = password ?? existingCuration.password;
  if (effectivePassword !== existingCuration.password) {
    const err = new Error("비밀번호가 일치하지 않습니다");
    err.status = 403;
    throw err;
  }

  const updatedCuration = await prisma.curation.update({
      where: { id: curationId },
      data: {
        nickname,
        content,
        trendy,
        personality,
        practicality,
        costEffectiveness
      },
    }); 

   
  const styleWithCurations = await prisma.style.findUnique({
    where: { id: existingCuration.styleId },
    include: { curations: true }
  });
  return styleWithCurations.curations;
};

 // 기존 큐레이션 조회
export const deleteCuration = async (curationId, password) => {
  // 요청 검증
  if (isNaN(curationId)) {
    const err = new Error("잘못된 요청입니다");
    err.status = 400;
    throw err;
  }
  
  const existingCuration = await prisma.curation.findUnique({
    where: { id: curationId }
  });

  if (!existingCuration) {
    const err = new Error("존재하지 않습니다");
    err.status = 404;
    throw err;
  }

  
  if (!password || password !== existingCuration.password) { 
    const err = new Error("비밀번호가 일치하지 않습니다");
    err.status = 403;
    throw err;
  }
  
  await prisma.curation.delete({
    where: { id: curationId }
});
  
  const styleWithCurations = await prisma.style.findUnique({
    where: { id: existingCuration.styleId },
    include: { curations: true }
  });
  return styleWithCurations.curations;
};

export const searchCurationsByKeyword = async (keyword) => {
  if (!keyword) {
    const err = new Error("검색어가 필요합니다")
    err.status = 400;
    throw err;
}

  
  const curations = await prisma.curation.findMany({
    where: {
      OR: [
        { nickname: { contains: keyword, mode: "insensitive"} }, 
        { content: { contains: keyword, mode: "insensitive"} }, 
      ],
    },
  });

  return curations;
};
