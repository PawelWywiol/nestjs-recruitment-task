import { mockUser } from '../../users/__mocks__/users.service.mock';

export const mockPrismaService = {
  user: {
    findMany: jest.fn().mockResolvedValue([mockUser]),
    count: jest.fn().mockResolvedValue(1),
    findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === mockUser.id) {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    }),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
} as const;
