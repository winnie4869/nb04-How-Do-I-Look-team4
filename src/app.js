import express from "express";
import prisma from './client/prisma-client.js';
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

//lsj 지우지마세요 큰일나요
//import { ErrorHandler } from "./lib/error-handler.js";
import commentRouter from "./routers/comment-router.js";
//import prisma from "./client/prisma-client.js";


import curationRouter from './routers/curating-router.js';
import errorHandler from "./middlewares/errorHandler-middleware.js"; //default로 export한 건 중괄호 없이 가져와야 됨
import path from "path"; 
import { fileURLToPath } from "url"; 


// import styleRouter from "./routers/style-router.js";
// import rankingRouter from "./routers/ranking-router.js";
// import commentRouter from "./routers/comment-router.js";
// import tagRouter from "./routers/tag-router.js";
// import imageRouter from "./routers/image-router.js";

const app = express();
const port = process.env.PORT || 3001;


/* 1) 코어 미들웨어는 라우터보다 먼저 */
app.use(cors({ origin: "*" }));
app.use(express.json());

// 이미지 절대 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = path.join(__dirname,"uploads");

app.use("/files",express.static(upload));

app.use(process.env.STATIC_FILE_PATH || '/files', express.static(path.join(__dirname, 'uploads')));

app.use('/', curationRouter); 
// app.use('/', styleRouter);
// app.use('/', rankingRouter);
app.use('/', commentRouter);
// app.use('/', tagRouter);
// app.use('/', imageRouter);
app.use(errorHandler);



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

/* 4) 404 (항상 마지막 일반 라우트) */

// app.use("/", styleRouter);

// 랭킹 라우터 연결 (기본 경로가 /ranking)
// app.use('/ranking', rankingRouter);

// 모든 라우터가 처리하지 못한 요청에 대한 404 Not Found 핸들러
// 이 미들웨어는 항상 가장 마지막에 위치해야 합니다. (와일드카드 '*')

app.all(/(.*)/, (req, res) => {
  res.status(404).send({ message: "요청하신 리소스를 찾을 수 없습니다." });
});

// // 애플리케이션 종료 시 Prisma 클라이언트 연결 해제
// process.on('beforeExit', async () => {
//   console.log('Server is shutting down. Disconnecting from database...');
//   await prisma.$disconnect();
// });

// app.use(errorHandler);

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


// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function testDB() {
  try {
    await prisma.$connect();
    console.log("✅ DB 연결 성공!");
  } catch (err) {
    console.error("❌ DB 연결 실패:", err);
  }
}
testDB();

export default app;
