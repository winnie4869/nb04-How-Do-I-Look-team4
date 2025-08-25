import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";

import prisma from './client/prisma-client.js';
import styleRouter from "./routers/style-router.js";
import rankingRouter from "./routers/ranking-router.js";
import curationRouter from "./routers/curation-router.js";
import commentRouter from "./routers/comment-router.js";
import tagRouter from "./routers/tag-router.js";
import imageRouter from "./routers/image-router.js";

import errorHandler from './middlewares/error-handler.js';

const app = express();
const port = process.env.PORT || 3001;


// 1. 미들웨어 등록
app.use(express.json());
app.use(cors({
    origin: "*"
}));

// 2. 정적 파일 미들웨어 (가장 위에 위치해야 함)
// 환경 변수 STATIC_FILE_PATH가 있다면 그 값을 사용하고, 없다면 '/files'를 기본값으로 사용합니다.
app.use(process.env.STATIC_FILE_PATH || '/files', express.static(path.join(process.cwd(), 'uploads')));



// 3. 라우터 연결
app.use("/", styleRouter);
app.use("/", rankingRouter);
app.use("/", curationRouter);
app.use("/", commentRouter);
app.use("/", tagRouter);
app.use("/", imageRouter);

// 4. 루트 경로 응답
app.get("/", (req, res) => {
    res.send("프로젝트 백엔드 서버 정상");
});

// 5. 404 Not Found 핸들러 (모든 라우터 뒤에 위치해야 함)
app.all(/(.*)/, (req, res) => {
    res.status(404).send({ message: '요청하신 리소스를 찾을 수 없습니다.' });
});

// 6. 전역 에러 핸들러 미들웨어 등록 (모든 라우터와 404 핸들러 뒤에 위치해야 함)
app.use(errorHandler);

// 7. 서버 실행
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// 8. 애플리케이션 종료 시 Prisma 클라이언트 연결 해제
process.on('beforeExit', async () => {
  console.log('Server is shutting down. Disconnecting from database...');
  await prisma.$disconnect(); 
});
