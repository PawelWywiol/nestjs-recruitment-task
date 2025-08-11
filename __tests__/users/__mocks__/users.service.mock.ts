import type { PaginatedResponse } from 'src/types/pagination';
import { DEFAULT_USERS_PAGE_INDEX, USERS_PER_PAGE } from 'src/users/users.config';
import type { UserPayload } from 'src/users/users.types';

export const mockUser: UserPayload = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  initials: 'JD',
  email: 'john.doe@example.com',
  status: 'ACTIVE',
};

export const mockPaginatedResponse: PaginatedResponse<UserPayload> = {
  items: [mockUser],
  page: DEFAULT_USERS_PAGE_INDEX,
  pages: 1,
};

export const mockUsersService = {
  findAll: jest
    .fn()
    .mockImplementation((_page = DEFAULT_USERS_PAGE_INDEX, _itemsPerPage = USERS_PER_PAGE) => {
      return Promise.resolve(mockPaginatedResponse);
    }),
  findOne: jest.fn().mockImplementation((id: number) => {
    if (id === mockUser.id) {
      return Promise.resolve(mockUser);
    }
    throw new Error(`User with ID '${id}' was not found`);
  }),
} as const;

export class MockResourceNotFoundException extends Error {
  constructor(resourceName: string, id?: string | number) {
    super(`${resourceName}${id ? ` with ID '${id}'` : ''} was not found`);
    this.name = 'ResourceNotFoundException';
  }
}
