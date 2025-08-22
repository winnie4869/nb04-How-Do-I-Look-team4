import express from "express";
import cors from "cors";
import "dotenv/config";
import curationRouter from './routers/curating-router.js';
import { errorHandler } from "./middilewares/errorHandler.js";
import path from "path"; 
import { fileURLToPath } from "url"; 

// import styleRouter from "./routers/style-router.js";
// import rankingRouter from "./routers/ranking-router.js";
// import commentRouter from "./routers/comment-router.js";
// import tagRouter from "./routers/tag-router.js";
// import imageRouter from "./routers/image-router.js";


const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({
    origin: "*"
}));

app.use(process.env.STATIC_FILE_PATH || '/files', express.static(path.join(__dirname, 'uploads')));

app.use('/styles', curationRouter); 
// app.use("/", styleRouter);
// app.use("/", rankingRouter);
// app.use("/", commentRouter);
// app.use("/", tagRouter);
// app.use("/", imageRouter);
app.use(errorHandler);


app.get("/", (req, res) => {
    res.send("서버 정상");
});

app.use("/", styleRouter);

// 랭킹 라우터 연결 (기본 경로가 /ranking)
app.use('/ranking', rankingRouter);

// 모든 라우터가 처리하지 못한 요청에 대한 404 Not Found 핸들러
// 이 미들웨어는 항상 가장 마지막에 위치해야 합니다. (와일드카드 '*')
app.all(/(.*)/, (req, res) => {
    res.status(404).send({ message: '요청하신 리소스를 찾을 수 없습니다.' });
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// 애플리케이션 종료 시 Prisma 클라이언트 연결 해제
process.on('beforeExit', async () => {
  console.log('Server is shutting down. Disconnecting from database...');
  await prisma.$disconnect();
});

