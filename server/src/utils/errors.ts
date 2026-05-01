import { HttpStatusCode } from '../common/errorCodes';
import { ResponseMessages } from '../common/erroResponse';
import { User } from '../domain/entities/User';

export class CustomError extends Error {
  constructor(
    message: string,
    public statusCode: HttpStatusCode,
   public data?:User
  ) {
    super(message);
    this.name = this.constructor.name;;
    this.data=data
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = ResponseMessages.INVALID_INPUT) {
    super(message, HttpStatusCode.BAD_REQUEST);
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = ResponseMessages.UNAUTHORIZED) {
    super(message, HttpStatusCode.UNAUTHORIZED);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = ResponseMessages.FORBIDDEN) {
    super(message, HttpStatusCode.FORBIDDEN);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = ResponseMessages.NO_CONTENT) {
    super(message, HttpStatusCode.NOT_FOUND);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = ResponseMessages.CONFLICT) {
    super(message, HttpStatusCode.CONFLICT);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = ResponseMessages.INTERNAL_SERVER_ERROR) {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}
