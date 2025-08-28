import { Router } from "express";
import { createComment, updateComment, deleteComment } from "../controllers/comment-controller.js";

const router = Router();

// 답글 등록
router.post("/curations/:curationId/comments", createComment);

// 답글 수정
router.put("/comments/:commentId", updateComment);

// 답글 삭제
router.delete("/comments/:commentId", deleteComment);

export default router;
