import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: "*"
}));

app.get("/", (req, res) => {
    res.send("서버 정상");
});

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

