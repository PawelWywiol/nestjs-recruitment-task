import type { PaginatedResponse } from 'src/types/pagination';
import {
  USERS_ADDRESSES_PER_PAGE,
  type UserAddressPayload,
} from 'src/users-addresses/users-addresses.config';

export const mockAddress: UserAddressPayload = {
  userId: 1,
  addressType: 'HOME',
  validFrom: new Date('2025-01-01T00:00:00.000Z'),
  postCode: '12345',
  city: 'New York',
  countryCode: 'USA',
  street: 'Broadway',
  buildingNumber: '123A',
};

export const mockPaginatedResponse: PaginatedResponse<UserAddressPayload> = {
  items: [mockAddress],
  page: 1,
  pages: 1,
};

export const mockUsersAddressesService = {
  findAll: jest
    .fn()
    .mockImplementation((_userId: number, _page = 1, _itemsPerPage = USERS_ADDRESSES_PER_PAGE) => {
      return Promise.resolve(mockPaginatedResponse);
    }),
  upsert: jest.fn().mockImplementation((_item: UserAddressPayload, values: UserAddressPayload) => {
    return Promise.resolve(values);
  }),
  delete: jest.fn().mockImplementation((item: UserAddressPayload) => {
    if (
      item.userId === mockAddress.userId &&
      item.addressType === mockAddress.addressType &&
      item.validFrom.getTime() === mockAddress.validFrom.getTime()
    ) {
      return Promise.resolve(true);
    }
    throw new Error('Address not found or already deleted');
  }),
} as const;

export class MockResourceNotFoundException extends Error {
  constructor(resourceName: string, details?: string) {
    super(`${resourceName}${details ? ` with ${details}` : ''} was not found`);
    this.name = 'ResourceNotFoundException';
  }
}

export class MockValidationFailedException extends Error {
  constructor(_errors: Record<string, string[]>) {
    super('Validation failed');
    this.name = 'ValidationFailedException';
  }
}

export class MockInvalidParameterException extends Error {
  constructor(paramName: string, expectedType: string) {
    super(`Parameter '${paramName}' must be a valid ${expectedType}`);
    this.name = 'InvalidParameterException';
  }
}
