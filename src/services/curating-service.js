import prisma from "../client/prisma-client.js";
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
