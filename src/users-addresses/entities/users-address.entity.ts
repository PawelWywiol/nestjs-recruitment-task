import { ApiProperty } from '@nestjs/swagger';
import type { UsersAddress } from '@prisma/client';

import { ISO_COUNTRY_CODES_LIST, USER_ADDRESS_TYPES } from '../users-addresses.config';

export class UsersAddressEntity implements UsersAddress {
  @ApiProperty({
    description: 'User ID associated with this address',
    example: 1,
    type: Number,
    minimum: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Type of the address',
    example: 'HOME',
    enum: USER_ADDRESS_TYPES,
  })
  addressType: string;

  @ApiProperty({
    description: 'Date from which this address is valid',
    example: '2025-08-11T12:00:00.000Z',
    type: Date,
  })
  validFrom: Date;

  @ApiProperty({
    description: 'Postal code',
    example: '12345',
    maxLength: 6,
    minLength: 1,
  })
  postCode: string;

  @ApiProperty({
    description: 'City name',
    example: 'New York',
    maxLength: 60,
    minLength: 1,
  })
  city: string;

  @ApiProperty({
    description: 'ISO country code',
    example: 'USA',
    enum: ISO_COUNTRY_CODES_LIST,
  })
  countryCode: string;

  @ApiProperty({
    description: 'Street name',
    example: 'Broadway',
    maxLength: 100,
    minLength: 1,
  })
  street: string;

  @ApiProperty({
    description: 'Building number or identifier',
    example: '123A',
    maxLength: 60,
    minLength: 1,
  })
  buildingNumber: string;

  @ApiProperty({
    description: 'Date when the address was created',
    example: '2025-08-11T12:00:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the address was last updated',
    example: '2025-08-11T12:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;
}
