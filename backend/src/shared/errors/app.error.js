export class AppError extends Error {
  constructor(message, statusCode, code, details = undefined) {
    super(message);

    this.name = this.contructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Error.captureStackTrace?.(this, this.contructor);
  }
}