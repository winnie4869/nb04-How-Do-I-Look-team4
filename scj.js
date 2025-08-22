   const putCuration = async (curationId, { password, nickname, content, trendy, personality, practicality, costEffectiveness}) => {
  const existingCuration = await prisma.curation.findUnique({
    where: { id: curationId }
  });
  // 요청 검증
  if (isNaN(curationId)) {
    const err = new Error("잘못된 요청입니다");
    err.status = 400;
    throw err;
  }

  // 존재 여부 확인
  if (!existingCuration) {
    const err = new Error("존재하지 않습니다");
    err.status = 404;
    throw err;
  }

  // 비밀번호 체크
  if (password !== existingCuration.password) {
     const err = new Error("비밀번호 오류");
    err.status = 403;
    throw err;
  } 

  const updatedCuration = await prisma.curation.update({
      where: { id: curationId },
      data: {
        nickname,
        content,
        password,
        trendy,
        personality,
        practicality,
        costEffectiveness
      },
    }); 
   return updatedCuration;
};

 // 기존 큐레이션 조회
const deleteCuration = async (curationId, password) => {
  const existingCuration = await prisma.curation.findUnique({
    where: { id: curationId }
  });

  if (!existingCuration) {
    const err = new Error("존재하지 않습니다");
    err.status = 404;
    throw err;
  }

  if (password !== existingCuration.password) {
    const err = new Error("비밀번호 오류");
    err.status = 403;
    throw err;
  }

  const deletedCuration = await prisma.curation.delete({
    where: { id: curationId }
});
  return deletedCuration;
};