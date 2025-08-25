import prisma from "../client/prisma-client.js";
import bcrypt from 'bcrypt';

export class CurationService {

    async postCuration(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        // 큐레이션과 스타일 업데이트를 트랜잭션으로 묶음
        const newCuration = await prisma.$transaction(async (tx) => {
            // 1. 큐레이션 생성
            const createdCuration = await tx.curation.create({
                data: {
                    styleId: data.styleId,
                    nickname: data.nickname,
                    content: data.content,
                    password: hashedPassword, // 해싱된 비밀번호 사용
                    trendy: data.trendy,
                    personality: data.personality,
                    practicality: data.practicality,
                    costEffectiveness: data.costEffectiveness,
                },
            });
            // 2. 스타일의 curationCount 증가
            await tx.style.update({
                where: { id: data.styleId },
                data: {
                    curationCount: {
                        increment: 1,
                    },
                },
            });

            return createdCuration;
        });
        return newCuration;
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

            const [totalItems, rawCurations] = await prisma.$transaction([
                prisma.curation.count({
                    where: { styleId, ...searchContent },
                }),
                prisma.curation.findMany({
                    where: { styleId, ...searchContent },
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    include: {
                        comment: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                }),
            ]);

            const curations = rawCurations.map(curation => {
                return {
                    ...curation,
                    comment: curation.comment || {}
                };
            });

            const totalPages = Math.ceil(totalItems / pageSize);
            return {
                currentPage: page,
                totalPages,
                totalItemCount: totalItems,
                data: curations,
            };
        } catch (error) {
            console.log("Error fetching curations:", error);
            const err = new Error("잘못된 요청입니다");
            err.status = 500;
            throw err;
        }
    }

    // 큐레이션 수정 (PUT)
    async putCuration(curationId, password, updateData) {
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

        const passwordMatch = await bcrypt.compare(password, existingCuration.password);
        if (!passwordMatch) {
            const err = new Error("비밀번호가 틀렸습니다");
            err.status = 403;
            throw err;
        }

        const updatedCuration = await prisma.curation.update({
            where: { id: curationId },
            data: updateData,
            include: {
                comment: true
            }
        });
        return updatedCuration;
    }

    // 큐레이션 삭제 (DELETE)
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
        const passwordMatch = await bcrypt.compare(password, existingCuration.password);
        if (!passwordMatch) {
            const err = new Error("비밀번호가 틀렸습니다");
            err.status = 403;
            throw err;
        }
        
        await prisma.$transaction(async (tx) => {
            await tx.curation.delete({
                where: { id: curationId }
            });

            // 스타일의 curationCount 감소
            await tx.style.update({
                where: { id: existingCuration.styleId },
                data: {
                    curationCount: {
                        decrement: 1,
                    },
                },
            });
        });

        return { message: "큐레이팅 삭제 성공" };
    };
}