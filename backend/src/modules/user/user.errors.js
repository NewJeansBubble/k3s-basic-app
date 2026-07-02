import { AppError } from '../../shared/errors/app.error.js';

export class UserEmailAlreadyExistsError extends AppError {
  constructor() {
    super('Email already in use', 409, 'USER_EMAIL_ALREADY_EXISTS');
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super('User not found', 404, 'USER_NOT_FOUND');
  }
}

export class UserAccessDeniedError extends AppError {
  constructor() {
    super('You cannot access this user', 403, 'USER_ACCESS_DENIED');
  }
}
