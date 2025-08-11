import { Test, type TestingModule } from '@nestjs/testing';
import { DEFAULT_USERS_PAGE_INDEX } from 'src/users/users.config';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

import {
  MockResourceNotFoundException,
  mockPaginatedResponse,
  mockUser,
  mockUsersService,
} from './__mocks__/users.service.mock';

const TEST_FIND_ALL_UNDEFINED_PAGE_INDEX = 999;

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated list of users with default page', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(DEFAULT_USERS_PAGE_INDEX);

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockUsersService.findAll).toHaveBeenCalledWith(DEFAULT_USERS_PAGE_INDEX);
    });

    it('should return paginated list of users with custom page', async () => {
      const page = 2;
      mockUsersService.findAll.mockResolvedValue({
        ...mockPaginatedResponse,
        page,
      });

      const result = await controller.findAll(page);

      expect(result).toEqual({ ...mockPaginatedResponse, page });
      expect(mockUsersService.findAll).toHaveBeenCalledWith(page);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Database error';
      mockUsersService.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(controller.findAll(DEFAULT_USERS_PAGE_INDEX)).rejects.toThrow(errorMessage);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle not found error', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new MockResourceNotFoundException('User', TEST_FIND_ALL_UNDEFINED_PAGE_INDEX),
      );

      await expect(controller.findOne(TEST_FIND_ALL_UNDEFINED_PAGE_INDEX)).rejects.toThrow(
        'User with ID',
      );
    });
  });
});
