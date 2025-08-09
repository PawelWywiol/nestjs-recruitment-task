import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../entities/user.entity';

export class PaginatedUsersResponseDto {
  @ApiProperty({
    description: 'Array of users for the current page',
    type: [UserEntity],
  })
  items: UserEntity[];

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  pages: number;
}
