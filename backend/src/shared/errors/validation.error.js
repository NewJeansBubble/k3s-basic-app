import { AppError } from './app.error.js';

export class ValidationError extends AppError {
  constructor(details) {
    super('Invalid request data', 400, 'VALIDATION_ERROR', details);
  }
}
