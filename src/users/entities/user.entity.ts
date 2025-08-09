import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({
    description: 'Unique user identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "User's first name",
    example: 'John',
    nullable: true,
  })
  firstName: string | null;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: "User's initials",
    example: 'JD',
    nullable: true,
  })
  initials: string | null;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: "User's current status",
    example: 'ACTIVE',
    enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
  })
  status: string;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2025-08-10T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2025-08-10T12:00:00.000Z',
  })
  updatedAt: Date;
}
