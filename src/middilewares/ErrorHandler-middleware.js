export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // 에러 발생하면 프로그램이 호출한 함수들의 목록을 터미널에 에러 순으로 보여줌
                            // 에러가 발생한 시점에서부터 에러를 유발한 함수들이 어떤 순서로 호출되었는지 보여준대
  res.status(500).json({
    message: "서버 오류가 발생했습니다."});
};