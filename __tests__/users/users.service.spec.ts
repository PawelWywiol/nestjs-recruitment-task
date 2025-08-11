import { Test, type TestingModule } from '@nestjs/testing';

import { mockUser } from './__mocks__/users.service.mock';

import {
  InvalidParameterException,
  ResourceNotFoundException,
} from '../../src/errorHandler/exceptions/custom-exceptions';
import { PrismaService } from '../../src/prisma/prisma.service';
import { DEFAULT_USERS_PAGE_INDEX, USERS_PER_PAGE } from '../../src/users/users.config';
import { UsersService } from '../../src/users/users.service';
import { mockPrismaService } from '../prisma/__mocks__/prisma.service.mock';

const TEST_FIND_ALL_NEGATIVE_INDEX = -1;
const TEST_FIND_ALL_NULL_INDEX = 0;
const TEST_FIND_ALL_FLOAT_INDEX = 1.5;

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated list of users', async () => {
      const result = await service.findAll(DEFAULT_USERS_PAGE_INDEX);

      expect(result).toEqual({
        items: [mockUser],
        page: DEFAULT_USERS_PAGE_INDEX,
        pages: 1,
      });
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: USERS_PER_PAGE,
        orderBy: {
          createdAt: 'desc',
        },
        select: expect.any(Object),
      });
      expect(mockPrismaService.user.count).toHaveBeenCalled();
    });

    it('should return paginated list with custom page and items per page', async () => {
      const page = 2;
      const itemsPerPage = 10;

      await service.findAll(page, itemsPerPage);

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        skip: 10,
        take: itemsPerPage,
        orderBy: {
          createdAt: 'desc',
        },
        select: expect.any(Object),
      });
    });

    it('should throw InvalidParameterException for invalid page', async () => {
      await expect(service.findAll(TEST_FIND_ALL_NEGATIVE_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
      await expect(service.findAll(TEST_FIND_ALL_NULL_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
      await expect(service.findAll(TEST_FIND_ALL_FLOAT_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
    });

    it('should throw InvalidParameterException for invalid itemsPerPage', async () => {
      await expect(service.findAll(1, TEST_FIND_ALL_NEGATIVE_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
      await expect(service.findAll(1, TEST_FIND_ALL_NULL_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
      await expect(service.findAll(1, TEST_FIND_ALL_FLOAT_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const result = await service.findOne(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        select: expect.any(Object),
      });
    });

    it('should throw ResourceNotFoundException when user not found', async () => {
      const nonExistingId = 999;

      await expect(service.findOne(nonExistingId)).rejects.toThrow(ResourceNotFoundException);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: nonExistingId },
        select: expect.any(Object),
      });
    });

    it('should throw InvalidParameterException for invalid id', async () => {
      await expect(service.findOne(TEST_FIND_ALL_NEGATIVE_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
      await expect(service.findOne(TEST_FIND_ALL_NULL_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
      await expect(service.findOne(TEST_FIND_ALL_FLOAT_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
    });
  });
});
