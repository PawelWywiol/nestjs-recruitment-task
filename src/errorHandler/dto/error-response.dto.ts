import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: "User with ID '1' was not found",
  })
  message: string;

  @ApiProperty({
    description: 'Error timestamp',
    example: '2025-08-10T12:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/users/1',
  })
  path: string;
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Validation errors',
    example: {
      username: ['must be at least 3 characters', 'must be a string'],
      email: ['must be a valid email'],
    },
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  })
  errors: Record<string, string[]>;
}
