import prisma from "../client/prisma-client.js";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import bcrypt from 'bcrypt'

export class CurationService {
    //암호화 처리 가공하는 부분
    async createCuration(data) {
        const { password, ...restOfData } = data;
        const saltRound = 10; // 암호 보안 수준 정도 설정
        const hashedPassword = await bcrypt.hash(password, saltRound);
        return await prisma.curation.create({
            data: {
                ...restOfData,
                password: hashedPassword,
            },
        });
    }

    // 큐레이팅 목록 조회하기 
    async getCurations(styleId, page, pageSize, searchBy, keyword) {
        try {
            const searchContent = {};
            if (searchBy && keyword) {
                if (searchBy === "nickname" || searchBy === "content") {
                    searchContent[searchBy] = {
                        contains: keyword,
                    };
                }
            }

            const [totalItems, curations] = await prisma.$transaction([
                prisma.curation.count({
                    where: { styleId, ...searchContent },
                }),
                prisma.curation.findMany({
                    where: { styleId, ...searchContent },
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    include: {
                        comment: true, // 큐레이션과 연결된 모든 댓글 데이터까지 가져올 수 잇음
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                }),
            ]);

            const totalPages = Math.ceil(totalItems / pageSize);

            return {
                currentPage: page,
                totalPages,
                totalItemCount: totalItems,
                data: curations,
            };
        } catch (error) {
            console.log('"Error fetching curations:", error');
            throw new Error("큐레이션 목록을 가져오는 데 실패했습니다.");
        }
    }
}
=======
=======
import bcrypt from 'bcrypt'
>>>>>>> 5f659fc (Feature/khy (#9))

export class CurationService {
    //암호화 처리 부분 (post만 암호화 처리 하기 ..)
    async createCuration(data) {
        const { password, ...restOfData } = data;
        console.log('암호화 전 비밀번호:', password);

        const saltRound = 10; // 암호 보안 수준 정도 설정 (10-12가 적당하다고 함)
        const hashedPassword = await bcrypt.hash(password, saltRound);

        console.log('암호화 후 비밀번호:', hashedPassword);

        return await prisma.curation.create({
            data: {
                ...restOfData,
                password: hashedPassword,
            },
        });
=======
=======
>>>>>>> 58987fe (first commit)

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
>>>>>>> 50eaefa (edit controller (#10))
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 50eaefa (edit controller (#10))

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
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 81da860 (first (#8))
=======
};
>>>>>>> 5f659fc (Feature/khy (#9))
=======
>>>>>>> 50eaefa (edit controller (#10))
=======
=======
import bcrypt from 'bcrypt'

export class CurationService {
    //암호화 처리 부분 (post만 암호화 처리 하기 ..)
    async createCuration(data) {
        const { password, ...restOfData } = data;
        console.log('암호화 전 비밀번호:', password);

        const saltRound = 10; // 암호 보안 수준 정도 설정 (10-12가 적당하다고 함)
        const hashedPassword = await bcrypt.hash(password, saltRound);

        console.log('암호화 후 비밀번호:', hashedPassword);

        return await prisma.curation.create({
            data: {
                ...restOfData,
                password: hashedPassword,
            },
        });
    }

    // 큐레이팅 목록 조회하기 
    async getCurations(styleId, page, pageSize, searchBy, keyword) {
        const searchContent = {};
        if (searchBy && keyword) {
            if (searchBy === "nickname" || searchBy === "content") {
                searchContent[searchBy] = {
                    contains: keyword,
                };
            }
        }

        const [totalItems, curations] = await prisma.$transaction([
            prisma.curation.count({
                where: { styleId, ...searchContent},
            }),
            prisma.curation.findMany({
                where: { styleId, ...searchContent },
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: {
                comment: true, // 큐레이션과 연결된 모든 댓글 데이터까지 가져올 수 잇음
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
        ]);

        const totalPages = Math.ceil(totalItems / pageSize);

        return {
            currentPage: page,
            totalPages,
            totalItemCount: totalItems,
            data: curations,
        };
    }
}
>>>>>>> 8e816fa (first commit)
>>>>>>> 58987fe (first commit)
