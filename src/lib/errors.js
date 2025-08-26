// src/lib/errors.js
export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export class BadRequest extends HttpError {
  constructor(message = "Bad Request") { super(400, message); }
}
export class Forbidden extends HttpError {
  constructor(message = "Forbidden") { super(403, message); }
}
export class NotFound extends HttpError {
  constructor(message = "Not Found") { super(404, message); }
}

// (선택) default도 함께 내보내면 어디서든 가져오기 편함
export default { HttpError, BadRequest, Forbidden, NotFound };

