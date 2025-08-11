import { ApiProperty } from '@nestjs/swagger';

import { UsersAddressEntity } from '../entities/users-address.entity';

export class PaginatedUsersAddressesResponseDto {
  @ApiProperty({
    description: 'Array of user addresses for the current page',
    type: [UsersAddressEntity],
  })
  items: UsersAddressEntity[];

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
