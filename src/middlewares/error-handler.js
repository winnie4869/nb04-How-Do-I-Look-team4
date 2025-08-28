import { HttpError } from "./errors.js";

function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message
    });
  }

  let statusCode = 500;
  let message = '서버 오류가 발생했습니다.';

  if (err.name === 'ZodError') {
    statusCode = 400;
    message = '요청 데이터 형식이 올바르지 않습니다.';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = '요청한 데이터를 찾을 수 없습니다.';
  } else {
    if (err.status) {
      statusCode = err.status;
    }
    if (err.message) {
      message = err.message;
    }
  }

  console.error(err);
  res.status(statusCode).json({ status: statusCode, message });
}

export default errorHandler;
