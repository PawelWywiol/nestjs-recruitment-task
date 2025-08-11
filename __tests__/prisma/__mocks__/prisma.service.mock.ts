import { mockUser } from '../../users/__mocks__/users.service.mock';
import { mockAddress } from '../../usersAddresses/__mocks__/users-addresses.service.mock';

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
  usersAddress: {
    findMany: jest.fn().mockResolvedValue([mockAddress]),
    count: jest.fn().mockResolvedValue(1),
    findFirst: jest.fn().mockImplementation(({ where }) => {
      if (where.userId === mockAddress.userId && where.addressType === mockAddress.addressType) {
        return Promise.resolve(mockAddress);
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockResolvedValue(mockAddress),
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    deleteMany: jest.fn().mockImplementation(({ where }) => {
      if (where.userId === mockAddress.userId && where.addressType === mockAddress.addressType) {
        return Promise.resolve({ count: 1 });
      }
      return Promise.resolve({ count: 0 });
    }),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
} as const;
