import { Test, type TestingModule } from '@nestjs/testing';
import {
  InvalidParameterException,
  ValidationFailedException,
} from 'src/errorHandler/exceptions/custom-exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { USERS_ADDRESSES_PER_PAGE } from 'src/users-addresses/users-addresses.config';
import { UsersAddressesService } from 'src/users-addresses/users-addresses.service';

import { mockAddress } from './__mocks__/users-addresses.service.mock';

import { mockPrismaService } from '../prisma/__mocks__/prisma.service.mock';

const TEST_NEGATIVE_INDEX = -1;
const TEST_NULL_INDEX = 0;
const TEST_FLOAT_INDEX = 1.5;

describe('UsersAddressesService', () => {
  let service: UsersAddressesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersAddressesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersAddressesService>(UsersAddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated list of user addresses', async () => {
      const userId = 1;
      const page = 1;

      const result = await service.findAll(userId, page);

      expect(result).toEqual({
        items: [mockAddress],
        page: page,
        pages: 1,
      });
      expect(mockPrismaService.usersAddress.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: USERS_ADDRESSES_PER_PAGE,
        orderBy: {
          createdAt: 'desc',
        },
        where: { userId },
        select: expect.any(Object),
      });
      expect(mockPrismaService.usersAddress.count).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('should return paginated list with custom page and items per page', async () => {
      const userId = 1;
      const page = 2;
      const itemsPerPage = 10;

      await service.findAll(userId, page, itemsPerPage);

      expect(mockPrismaService.usersAddress.findMany).toHaveBeenCalledWith({
        skip: 10,
        take: itemsPerPage,
        orderBy: {
          createdAt: 'desc',
        },
        where: { userId },
        select: expect.any(Object),
      });
    });

    it('should throw InvalidParameterException for invalid userId', async () => {
      await expect(service.findAll(TEST_NEGATIVE_INDEX, 1)).rejects.toThrow(
        InvalidParameterException,
      );
      await expect(service.findAll(TEST_NULL_INDEX, 1)).rejects.toThrow(InvalidParameterException);
      await expect(service.findAll(TEST_FLOAT_INDEX, 1)).rejects.toThrow(InvalidParameterException);
    });

    it('should throw InvalidParameterException for invalid page', async () => {
      await expect(service.findAll(1, TEST_NEGATIVE_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
      await expect(service.findAll(1, TEST_NULL_INDEX)).rejects.toThrow(InvalidParameterException);
      await expect(service.findAll(1, TEST_FLOAT_INDEX)).rejects.toThrow(InvalidParameterException);
    });

    it('should throw InvalidParameterException for invalid itemsPerPage', async () => {
      await expect(service.findAll(1, 1, TEST_NEGATIVE_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
      await expect(service.findAll(1, 1, TEST_NULL_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
      await expect(service.findAll(1, 1, TEST_FLOAT_INDEX)).rejects.toThrow(
        InvalidParameterException,
      );
    });
  });

  describe('upsert', () => {
    it('should update an existing address', async () => {
      const updatedAddress = {
        ...mockAddress,
        postCode: '54321',
        city: 'San Francisco',
      };

      const result = await service.upsert(mockAddress, updatedAddress);

      expect(result).toEqual(updatedAddress);
      expect(mockPrismaService.usersAddress.findFirst).toHaveBeenCalled();
      expect(mockPrismaService.usersAddress.updateMany).toHaveBeenCalled();
    });

    it('should create a new address when it does not exist', async () => {
      const newAddress = {
        ...mockAddress,
        userId: 2,
      };

      mockPrismaService.usersAddress.findFirst.mockResolvedValue(null);

      const result = await service.upsert(newAddress, newAddress);

      expect(result).toEqual(newAddress);
      expect(mockPrismaService.usersAddress.findFirst).toHaveBeenCalled();
      expect(mockPrismaService.usersAddress.create).toHaveBeenCalled();
    });

    it('should throw ValidationFailedException for invalid data', async () => {
      mockPrismaService.usersAddress.findFirst.mockImplementationOnce(() => {
        throw new ValidationFailedException({ validFrom: ['Invalid date format'] });
      });

      const invalidAddress = {
        ...mockAddress,
        validFrom: 'invalid-date' as unknown as Date,
      };

      await expect(service.upsert(invalidAddress, invalidAddress)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete an existing address', async () => {
      const result = await service.delete(mockAddress);

      expect(result).toBe(true);
      expect(mockPrismaService.usersAddress.deleteMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          userId: mockAddress.userId,
          addressType: mockAddress.addressType,
        }),
      });
    });

    it('should throw error when address not found', async () => {
      const nonExistingAddress = {
        ...mockAddress,
        userId: 999,
      };

      mockPrismaService.usersAddress.deleteMany.mockResolvedValueOnce({ count: 0 });

      await expect(service.delete(nonExistingAddress)).rejects.toThrow(
        'Address not found or already deleted',
      );
    });

    it('should throw ValidationFailedException for invalid data', async () => {
      mockPrismaService.usersAddress.deleteMany.mockImplementationOnce(() => {
        throw new ValidationFailedException({ validFrom: ['Invalid date format'] });
      });

      const invalidAddress = {
        ...mockAddress,
        validFrom: 'invalid-date' as unknown as Date,
      };

      await expect(service.delete(invalidAddress)).rejects.toThrow();
    });
  });
});
