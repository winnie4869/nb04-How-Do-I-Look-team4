import express from "express";
import cors from "cors";
import "dotenv/config";

import prisma from './client/prisma-client.js';
import styleRouter from "./routers/style-router.js";
import rankingRouter from "./routers/ranking-router.js";
import curationRouter from './routers/curating-router.js';
import commentRouter from "./routers/comment-router.js";
import tagRouter from "./routers/tag-router.js";
import imageRouter from "./routers/image-router.js";
import errorHandler from './middlewares/error-handler.js';

const app = express();
const port = process.env.PORT || 3001;

app.set('trust proxy', true); 
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(process.env.STATIC_FILE_PATH || '/files', express.static('./uploads'));

app.use("/", styleRouter);
app.use("/", rankingRouter);
app.use("/", curationRouter);
app.use("/", commentRouter);
app.use("/", tagRouter);
app.use("/", imageRouter);

app.all(/(.*)/, (req, res) => {
  res.status(404).send({ message: "요청하신 리소스를 찾을 수 없습니다." });
});

app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function shutdown() {
  console.log("Server is shutting down. Disconnecting from database...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
