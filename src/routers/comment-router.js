import express from 'express';
import prisma from '../client/prisma-client.js';

const router = express.Router();

router.post('/curations/:curationId/comments', async (req, res) => {
  const { curationId } = req.params;
  const { content, password } = req.body;

  try {
    // 1. 유효성 검사
    const numericCurationId = Number(curationId);
    if (isNaN(numericCurationId) || numericCurationId <= 0 || !content || !password) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 2. 부모 큐레이션 및 스타일 조회
    const parentCuration = await prisma.curation.findUnique({
      where: { id: numericCurationId },
      include: {
        style: true, // 부모 스타일 정보도 함께 가져옴
        comment: true,
      }
    });

    if (!parentCuration) {
      return res.status(404).json({ message: '존재하지 않는 큐레이션 ID입니다.' });
    }
    
    // 3. 스타일 비밀번호 확인
    if (!parentCuration.style || parentCuration.style.password !== password) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }
    
    // 4. 이미 답글이 있는지 확인
    if (parentCuration.comment) {
      return res.status(409).json({ message: '해당 큐레이션에는 이미 답글이 존재합니다.' });
    }

    // 5. 답글 등록
    const newComment = await prisma.comment.create({
      data: {
        content,
        // 답글의 닉네임은 큐레이션의 닉네임과 동일하게 설정
        nickname: parentCuration.nickname,
        curationId: numericCurationId,
      },
    });

    // 6. 응답 명세서에 맞게 데이터 가공 및 반환
    const formattedResponse = {
      id: newComment.id,
      nickname: newComment.nickname,
      content: newComment.content,
      createdAt: newComment.createdAt,
    };

    res.status(200).json(formattedResponse);

  } catch (error) {
    console.error('답글 등록 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

router.put('/comments/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { content, password } = req.body;

  try {
    // 1. 유효성 검사
    const numericCommentId = Number(commentId);
    if (isNaN(numericCommentId) || numericCommentId <= 0 || !content || !password) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 2. 답글, 부모 큐레이션, 부모 스타일 조회
    const existingComment = await prisma.comment.findUnique({
      where: { id: numericCommentId },
      include: {
        curation: {
          include: {
            style: true,
          }
        }
      }
    });

    if (!existingComment) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 3. 스타일 비밀번호 확인
    if (!existingComment.curation || !existingComment.curation.style || existingComment.curation.style.password !== password) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }
    
    // 4. 답글 업데이트
    const updatedComment = await prisma.comment.update({
      where: { id: numericCommentId },
      data: {
        content,
      },
    });

    // 5. 응답 명세서에 맞게 데이터 가공 및 반환
    const formattedResponse = {
      id: updatedComment.id,
      nickname: updatedComment.nickname,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt,
    };

    res.status(200).json(formattedResponse);

  } catch (error) {
    console.error('답글 수정 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

router.delete('/comments/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { password } = req.body;

  try {
    // 1. 유효성 검사
    const numericCommentId = Number(commentId);
    if (isNaN(numericCommentId) || numericCommentId <= 0 || !password) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 2. 답글, 부모 큐레이션, 부모 스타일 조회
    const existingComment = await prisma.comment.findUnique({
      where: { id: numericCommentId },
      include: {
        curation: {
          include: {
            style: true,
          }
        }
      }
    });

    if (!existingComment) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 3. 스타일 비밀번호 확인
    if (!existingComment.curation || !existingComment.curation.style || existingComment.curation.style.password !== password) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }
    
    // 4. 답글 삭제
    await prisma.comment.delete({
      where: { id: numericCommentId },
    });

    // 5. 응답 반환
    res.status(200).json({ message: '답글 삭제 성공' });

  } catch (error) {
    console.error('답글 삭제 중 오류 발생:', error);
    // Prisma에서 답글이 존재하지 않을 때 발생하는 에러를 Catch
    if (error.code === 'P2025') {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

export default router;
