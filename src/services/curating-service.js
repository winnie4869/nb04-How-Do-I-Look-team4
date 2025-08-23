import prisma from "../client/prisma-client.js";
import bcrypt from 'bcrypt'

export class CurationService {

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
            console.log("Error fetching curations:", error);
            return {
                currentPage: 1,
                totalPages: 0,
                totalItemCount: 0,
                data: [],
            };
        }
    }

    async putCuration(curationId, data) {
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

        // 비밀번호 검증 (bcrypt.compare 사용)
        const { password, nickname, content, trendy, personality, practicality, costEffectiveness } = data; // data 객체에서 password를 구조분해 할당

        if (!password) {
            const err = new Error("비밀번호가 입력되지 않았습니다");
            err.status = 400;
            throw err;
        }

        const passwordMatch = await bcrypt.compare(password, existingCuration.password);

        if (!passwordMatch) {
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
    }

    // 기존 큐레이션 조회
    // 요청 검증

    async deleteCuration(curationId, password) {
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
};
