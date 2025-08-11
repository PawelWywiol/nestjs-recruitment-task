import { Test, type TestingModule } from '@nestjs/testing';
import { USERS_ADDRESSES_PER_PAGE } from 'src/users-addresses/users-addresses.config';
import { UsersAddressesController } from 'src/users-addresses/users-addresses.controller';
import { UsersAddressesService } from 'src/users-addresses/users-addresses.service';

import {
  mockAddress,
  mockPaginatedResponse,
  mockUsersAddressesService,
} from './__mocks__/users-addresses.service.mock';

describe('UsersAddressesController', () => {
  let controller: UsersAddressesController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersAddressesController],
      providers: [
        {
          provide: UsersAddressesService,
          useValue: mockUsersAddressesService,
        },
      ],
    }).compile();

    controller = module.get<UsersAddressesController>(UsersAddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated list of user addresses', async () => {
      const userId = 1;
      const page = 1;
      mockUsersAddressesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(userId, page);

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockUsersAddressesService.findAll).toHaveBeenCalledWith(
        userId,
        page,
        USERS_ADDRESSES_PER_PAGE,
      );
    });

    it('should return paginated list with custom page', async () => {
      const userId = 1;
      const page = 2;
      mockUsersAddressesService.findAll.mockResolvedValue({
        ...mockPaginatedResponse,
        page,
      });

      const result = await controller.findAll(userId, page);

      expect(result).toEqual({ ...mockPaginatedResponse, page });
      expect(mockUsersAddressesService.findAll).toHaveBeenCalledWith(
        userId,
        page,
        USERS_ADDRESSES_PER_PAGE,
      );
    });

    it('should handle service errors', async () => {
      const userId = 1;
      const page = 1;
      const errorMessage = 'Database error';
      mockUsersAddressesService.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(controller.findAll(userId, page)).rejects.toThrow(errorMessage);
    });
  });

  describe('upsert', () => {
    it('should create or update a user address', async () => {
      const createUserAddressDto = {
        userId: mockAddress.userId,
        addressType: mockAddress.addressType,
        validFrom: mockAddress.validFrom,
        postCode: mockAddress.postCode,
        city: mockAddress.city,
        countryCode: mockAddress.countryCode,
        street: mockAddress.street,
        buildingNumber: mockAddress.buildingNumber,
      };

      mockUsersAddressesService.upsert.mockResolvedValue(mockAddress);

      const result = await controller.upsert(createUserAddressDto);

      expect(result).toEqual(mockAddress);
      expect(mockUsersAddressesService.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: createUserAddressDto.userId,
          addressType: createUserAddressDto.addressType,
          validFrom: createUserAddressDto.validFrom,
        }),
        createUserAddressDto,
      );
    });

    it('should handle validation errors', async () => {
      const invalidDto = {
        userId: mockAddress.userId,
        addressType: 'INVALID_TYPE',
        validFrom: mockAddress.validFrom,
        postCode: mockAddress.postCode,
        city: mockAddress.city,
        countryCode: mockAddress.countryCode,
        street: mockAddress.street,
        buildingNumber: mockAddress.buildingNumber,
      };

      mockUsersAddressesService.upsert.mockRejectedValue(new Error('Validation failed'));

      await expect(controller.upsert(invalidDto)).rejects.toThrow('Validation failed');
    });
  });

  describe('delete', () => {
    it('should delete a user address', async () => {
      const userAddressPrimaryKeyDto = {
        userId: mockAddress.userId,
        addressType: mockAddress.addressType,
        validFrom: mockAddress.validFrom,
      };

      mockUsersAddressesService.delete.mockResolvedValue(true);

      const result = await controller.delete(userAddressPrimaryKeyDto);

      expect(result).toBe(true);
      expect(mockUsersAddressesService.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: userAddressPrimaryKeyDto.userId,
          addressType: userAddressPrimaryKeyDto.addressType,
          validFrom: userAddressPrimaryKeyDto.validFrom,
        }),
      );
    });

    it('should handle not found error', async () => {
      const nonExistingDto = {
        userId: 999,
        addressType: mockAddress.addressType,
        validFrom: mockAddress.validFrom,
      };

      mockUsersAddressesService.delete.mockRejectedValue(
        new Error('Address not found or already deleted'),
      );

      await expect(controller.delete(nonExistingDto)).rejects.toThrow(
        'Address not found or already deleted',
      );
    });
  });
});
