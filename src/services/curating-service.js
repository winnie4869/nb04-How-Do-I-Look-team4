import prisma from "../client/prisma-client.js";
import bcrypt from 'bcrypt'

export class CurationService {

    async createCuration(data) {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/;
        if (!passwordRegex.test(data.password)) {
            const err = new Error("잘못된 요청입니다");
            err.status = 400;
            throw err;
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newCuration = await prisma.curation.create({
            data: {
                styleId: data.styleId,
                nickname: data.nickname,
                content: data.content,
                password: data.hashedPassword,
                trendy: data.trendy,
                personality: data.personality,
                practicality: data.practicality,
                costEffectiveness: data.costEffectiveness,
            },
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
                    comment: true, // 큐레이션과 연결된 모든 댓글 데이터까지 가져올 수 잇음
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

    // 비밀번호 검증 (bcrypt.compare 사용)
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

    await prisma.curation.delete({
        where: { id: curationId }
    });

    return { message: "큐레이팅 삭제 성공" };
};
};