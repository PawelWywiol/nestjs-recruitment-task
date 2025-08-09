import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
// biome-ignore lint/style/useImportType: These types are used in runtime type assertions
import { Request, Response } from 'express';

/**
 * Global HTTP exception filter that handles all exceptions
 * thrown within the application and formats them into a consistent response format.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message, error } = this.getErrorResponse(exception);

    this.logger.error(
      `${request.method} ${request.url} - ${statusCode} - ${error || message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(statusCode).json({
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getErrorResponse(exception: unknown): {
    statusCode: number;
    message: string;
    error?: string;
  } {
    // Handle HttpExceptions (NestJS built-in exceptions)
    if (exception instanceof HttpException) {
      return {
        statusCode: exception.getStatus(),
        message: exception.message,
        error: exception.name,
      };
    }

    // Handle Prisma Client Errors
    if (exception instanceof PrismaClientKnownRequestError) {
      return this.handlePrismaError(exception);
    }

    // Handle generic Error objects
    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: exception.name,
      };
    }

    // Handle unknown errors
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Unknown error',
    };
  }

  private handlePrismaError(exception: PrismaClientKnownRequestError): {
    statusCode: number;
    message: string;
    error: string;
  } {
    // Handle specific Prisma error codes
    // See: https://www.prisma.io/docs/reference/api-reference/error-reference
    switch (exception.code) {
      case 'P2002': // Unique constraint violation
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'A record with this value already exists',
          error: 'Unique Constraint Violation',
        };
      case 'P2025': // Record not found
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'The requested record was not found',
          error: 'Not Found',
        };
      case 'P2003': // Foreign key constraint failed
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Related record not found',
          error: 'Foreign Key Constraint Violation',
        };
      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Database error: ${exception.message}`,
          error: `Prisma Error (${exception.code})`,
        };
    }
  }
}
