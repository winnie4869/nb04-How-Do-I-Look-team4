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

export default { HttpError, BadRequest, Forbidden, NotFound };
