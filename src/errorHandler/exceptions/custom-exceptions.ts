import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends HttpException {
  constructor(resourceName: string, id?: string | number) {
    super(`${resourceName}${id ? ` with ID '${id}'` : ''} was not found`, HttpStatus.NOT_FOUND);
  }
}

export class ResourceAlreadyExistsException extends HttpException {
  constructor(resourceName: string, field?: string, value?: string | number) {
    const message =
      field && value
        ? `${resourceName} with ${field} '${value}' already exists`
        : `${resourceName} already exists`;

    super(message, HttpStatus.CONFLICT);
  }
}

export class ValidationFailedException extends HttpException {
  constructor(errors: Record<string, string[]>) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UnauthorizedActionException extends HttpException {
  constructor(message: string = 'You are not authorized to perform this action') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class InvalidParameterException extends HttpException {
  constructor(paramName: string, expectedType: string) {
    super(`Parameter '${paramName}' must be a valid ${expectedType}`, HttpStatus.BAD_REQUEST);
  }
}
