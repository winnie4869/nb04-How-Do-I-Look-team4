import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import prisma from './client/prisma-client.js';
import styleRouter from "./routers/style-router.js";
import rankingRouter from "./routers/ranking-router.js";
import curationRouter from './routers/curating-router.js';
import commentRouter from "./routers/comment-router.js";
import tagRouter from "./routers/tag-router.js";
import imageRouter from "./routers/image-router.js";

// import errorHandler from './middlewares/error-handler.js'; // 스타일
import errorHandler from "./middlewares/errorHandler-middleware.js"; //default로 export한 건 중괄호 없이 가져와야 됨

//lsj 지우지마세요 큰일나요
//import { ErrorHandler } from "./lib/error-handler.js";

const app = express();
const port = process.env.PORT || 3001;

// 1. 미들웨어 등록
/* 1) 코어 미들웨어는 라우터보다 먼저 */
app.use(cors({ origin: "*" }));
app.use(express.json());

// 2. 정적 파일 미들웨어 (가장 위에 위치해야 함)


// 3. 라우터 연결
app.use("/", styleRouter);
app.use("/", rankingRouter);
app.use("/", curationRouter);
app.use("/", commentRouter);
app.use("/", tagRouter);
app.use("/", imageRouter);

// 4. 404
app.all(/(.*)/, (req, res) => {
  res.status(404).send({ message: "요청하신 리소스를 찾을 수 없습니다." });
});

// 5. 전역 에러 핸들러 미들웨어 등록 (모든 라우터와 404 핸들러 뒤에 위치해야 함)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/* 7) 종료는 시그널에서만 (beforeExit 제거) */
async function shutdown() {
  console.log("Server is shutting down. Disconnecting from database...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

server.on('close', () => console.log('[server] close'));
server.on('listening', () => console.log('[server] listening event'));
server.on('error', (e) => console.log('[server] error', e));

