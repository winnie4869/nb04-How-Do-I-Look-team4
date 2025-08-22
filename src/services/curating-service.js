import prisma from "../client/prisma-client.js";
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
            console.log(curations);
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
}