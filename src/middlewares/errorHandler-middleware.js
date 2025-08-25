export default function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "서버 오류", 
  });
}
//success message -> 부분 공통된 방식으로 처리 내보내기 