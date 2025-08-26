// src/controllers/comment-controller.js
import prisma from "../client/prisma-client.js";
import * as Errors from "../lib/errors.js";

const BadRequest = Errors.BadRequest || Errors.default?.BadRequest;
const Forbidden  = Errors.Forbidden  || Errors.default?.Forbidden;
const NotFound   = Errors.NotFound   || Errors.default?.NotFound;


// 비밀번호 대조 part 
async function CommentPasswordCheck(curationId, password) {
  const row = await prisma.curation.findUnique({
    where: { id: Number(curationId) },
    select: { style: { select: { password: true, nickname: true } } },
  });

  if (!row) {
    throw new NotFound("존재하지 않는 큐레이팅입니다.");
  }
  if (!row.style) {
    // 큐레이팅은 있는데 연결된 스타일이 없는 경우 방어
    throw new NotFound("큐레이팅에 연결된 스타일을 찾을 수 없습니다.");
  }
  if (typeof password !== "string" || !password.trim()) {
    throw new BadRequest("password는 필수 입니다.");
  }
  if (password !== row.style.password) {
    throw new Forbidden("비밀번호가 일치하지 않습니다.");
  }

  // style.nickname을 댓글에 복사해 쓰는 경우 반환 (안 쓰면 반환값 무시 가능)
  return row.style.nickname;
}

// POST /curations/:curationId/comments
export async function createComment(req, res, next) {
  try {
    const { curationId } = req.params;
    const { password,  content } = req.body || {};
    const curationIdNum = Number(curationId);

    // 입력 검증
    if (!password?.trim()) throw new BadRequest("password는 필수 입니다.");
    if (!content?.trim()) throw new BadRequest("content는 필수 입니다.");
    
    const styleNickname = await CommentPasswordCheck(curationIdNum, password);

        // 비밀번호 대조 + style 가져오기
    const curation = await prisma.curation.findUnique({
      where: { id : curationIdNum },
      select: {
        style: { select: { password: true, nickname: true}}
      },
    });
    if (!curation) throw new NotFound("존재하지 않는 큐레이팅입니다.");
    if (password !== curation.style.password) {
      throw new Forbidden("비밀번호가 일치하지 않습니다.");
    }

    const exists = await prisma.comment.findUnique({
      where: { curationId: curationIdNum },
    });
    if (exists) throw new BadRequest("이미 해당 큐레이팅에 답글이 존재합니다.");

    // style.nickname 사용해서 댓글 작성
    const created = await prisma.comment.create({
      data: { 
        curationId: curationIdNum, 
        content: content.trim(),
        nickname: curation.style.nickname,
      },
      select: { id: true, nickname: true, content: true, createdAt: true },
    });

    res.status(201).json({created,nickname: curation?.style?.nickname ?? null});
  } catch (err) {
    next(err);
  }
}

// PUT /comments/:commentId
export async function updateComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const { content, password, nickname } = req.body ?? {};
    const id = Number(commentId);

    if (!content?.trim()) throw new BadRequest("content는 필수입니다.");
    if (!password?.trim()) throw new BadRequest("password는 필수입니다.");

    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
      select: { id: true, curationId: true },
    });
    if (!comment) throw new NotFound("존재하지 않는 답글입니다.");

    await CommentPasswordCheck(comment.curationId, password);
    
    //content 필수
    if (!content?.trim()) throw new  BadRequest("수정할 content를 보내주세요. ")

    const updated = await prisma.comment.update({
      where: { id: comment.id },
      data: { content: content.trim() },
      select: { id: true, content: true, updatedAt: true, nickname: true },
    });
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /comments/:commentId
export async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const { password } = req.body || {};
    const id = Number(commentId)

    if (!password?.trim()) throw new BadRequest("password는 필수입니다.");

     const comment = await prisma.comment.findUnique({
      where: { id },
      select: { id: true, curationId: true },
    });
    if (!comment) throw new NotFound("존재하지 않는 답글입니다.");
    
    await CommentPasswordCheck(comment.curationId, password);

    await prisma.comment.delete({ where: { id } });
    res.json({ success: true, message: "댓글이 삭제되었습니다." });

    return res.status(204).send(); // 본문 없음
  } catch (err) {
    next(err);
  }
}
