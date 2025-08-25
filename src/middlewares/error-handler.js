const errorHandler = (err, req, res, next) => {
  console.error(err); // 서버 로그에 에러를 기록하여 디버깅에 활용

  // 클라이언트에게 보낼 에러 메시지와 상태 코드
  let statusCode = 500;
  let message = '서버 오류가 발생했습니다.';

  // Zod 유효성 검사 에러 처리
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = '요청 데이터 형식이 올바르지 않습니다.';
  }

  // 데이터베이스 관련 에러 (예: Prisma) 처리
  // P2025: 찾을 수 없는 레코드를 업데이트하거나 삭제하려고 할 때 발생하는 에러 코드
  if (err.code === 'P2025') {
    statusCode = 404;
    message = '요청한 데이터를 찾을 수 없습니다.';
  }

  // 사용자 정의 에러 처리 (예: 비밀번호 불일치, 권한 부족 등)
  // 향후 구현될 커스텀 에러 클래스에 따라 확장 가능
  if (err.status) {
    statusCode = err.status;
  }
  if (err.message) {
    message = err.message;
  }

  // 최종 응답 전송
  res.status(statusCode).json({ message });
};

export default errorHandler;
