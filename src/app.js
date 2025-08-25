import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path"
//
import router from "./routers/comment-router.js";
import { ErrorHandler } from "./lib/error-handler.js";
import prisma from "./client/prisma-client.js";

import curationRouter from "./routers/curation-router.js";
import ImageRouter from "./routers/image-router.js";
import rankingRouter from "./routers/ranking-router.js";
import styleRouter from "./routers/style-router.js";
import tagRouter from "./routers/tag-router.js";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

/* 1) 코어 미들웨어는 라우터보다 먼저 */
app.use(cors({ origin: "*" }));
app.use(express.json());

/* 2) 라우터 등록 */
app.use(router);  // prefix 필요하면 여기서만 수정

app.use("/", styleRouter);
app.use("/", curationRouter);
app.use("/", tagRouter);
app.use("/", ImageRouter);
app.use("/", rankingRouter);

// 이미지 절대 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = path.join(__dirname,"uploads");

app.use("/files",express.static(upload));



/* 3) 임시/일반 라우트 */
app.get("/tags", async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      select: { id: true, name: true, _count: { select: { styles: true } } }
    });
    res.json(tags);
  } catch (e) { next(e); }
});

app.get("/", (req, res) => {
  res.send("서버 정상");
});

/* 4) 404 (항상 마지막 일반 라우트) */
app.all(/(.*)/, (req, res) => {
  res.status(404).send({ message: "요청하신 리소스를 찾을 수 없습니다." });
});

/* 5) 에러 핸들러는 진짜 맨 마지막 */
app.use(ErrorHandler);

/* 6) 서버 실행 */
const server = app.listen(port, () => {
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

