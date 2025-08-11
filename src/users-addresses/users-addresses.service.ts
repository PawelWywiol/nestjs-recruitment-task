import { Injectable } from '@nestjs/common';
import { normalizeDateToSeconds, resolveDateRangeInSeconds } from 'src/lib/date/date.utils';
// biome-ignore lint/style/useImportType: NestJS DI requires importing the actual class, not just the type
import { PrismaService } from 'src/prisma/prisma.service';
import type { PaginatedResponse } from 'src/types/pagination';

import {
  GET_USERS_ADDRESSES_PAYLOAD,
  USERS_ADDRESSES_PER_PAGE,
  type UserAddressPayload,
} from './users-addresses.config';
import {
  type ValidUserAddressPayload,
  validateUserAddress,
  validateUserAddressPrimaryKey,
} from './users-addresses.validation';

import {
  InvalidParameterException,
  ResourceAlreadyExistsException,
  ValidationFailedException,
} from '../errorHandler/exceptions/custom-exceptions';

@Injectable()
export class UsersAddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: number,
    page: number,
    itemsPerPage: number = USERS_ADDRESSES_PER_PAGE,
  ): Promise<PaginatedResponse<UserAddressPayload>> {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new InvalidParameterException('userId', 'positive integer');
    }

    if (!Number.isInteger(page) || page <= 0) {
      throw new InvalidParameterException('page', 'positive integer');
    }

    if (!Number.isInteger(itemsPerPage) || itemsPerPage <= 0) {
      throw new InvalidParameterException('itemsPerPage', 'positive integer');
    }

    const [items, total] = await Promise.all([
      this.prisma.usersAddress.findMany({
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
        orderBy: {
          createdAt: 'desc',
        },
        where: { userId },
        ...GET_USERS_ADDRESSES_PAYLOAD,
      }),
      this.prisma.usersAddress.count({
        where: { userId },
      }),
    ]);

    return { items, page, pages: Math.ceil(total / itemsPerPage) };
  }

  async upsert(
    item: UserAddressPayload,
    values: ValidUserAddressPayload,
  ): Promise<ValidUserAddressPayload> {
    const itemValidation = validateUserAddressPrimaryKey(item);
    const valuesValidation = validateUserAddress(values);

    if (!itemValidation.isSuccess) {
      throw new ValidationFailedException(itemValidation.error);
    }

    if (!valuesValidation.isSuccess) {
      throw new ValidationFailedException(valuesValidation.error);
    }

    const validItem = itemValidation.data;
    const validValues = valuesValidation.data;
    const dataValidFromNormalizedValue = normalizeDateToSeconds(validValues.validFrom);
    const dataValidFromDateRange = resolveDateRangeInSeconds(validValues.validFrom);
    const itemValidFromDateRange = resolveDateRangeInSeconds(validItem.validFrom);

    if (!dataValidFromNormalizedValue || !dataValidFromDateRange || !itemValidFromDateRange) {
      throw new InvalidParameterException(
        'validFrom',
        'valid date in ISO 8601 format or Date object',
      );
    }

    const existing = await this.prisma.usersAddress.findFirst({
      where: {
        userId: validItem.userId,
        addressType: validItem.addressType,
        validFrom: itemValidFromDateRange,
      },
    });

    if (existing) {
      const existingValidFromDateRange = resolveDateRangeInSeconds(existing?.validFrom);

      if (!existingValidFromDateRange) {
        throw new InvalidParameterException(
          'validFrom',
          'valid date in ISO 8601 format or Date object',
        );
      }

      const newData = await this.prisma.usersAddress.updateMany({
        where: {
          userId: existing.userId,
          addressType: existing.addressType,
          validFrom: existingValidFromDateRange,
        },
        data: {
          ...validValues,
          validFrom: dataValidFromNormalizedValue,
        },
      });

      if (!newData.count) {
        const blockerData = await this.prisma.usersAddress.findFirst({
          where: {
            userId: validItem.userId,
            addressType: validItem.addressType,
            validFrom: itemValidFromDateRange,
          },
        });

        if (blockerData) {
          throw new ResourceAlreadyExistsException(
            'User address',
            `User ID: ${validItem.userId}, Address Type: ${validItem.addressType}, Valid From: ${validItem.validFrom}`,
          );
        }

        throw new Error('Failed to update address.');
      }

      return validValues;
    }

    await this.prisma.usersAddress.create({
      data: {
        ...validValues,
        userId: validItem.userId,
        addressType: validItem.addressType,
        validFrom: dataValidFromNormalizedValue,
      },
    });

    return validValues;
  }

  async delete(item: UserAddressPayload): Promise<boolean> {
    const itemValidation = validateUserAddressPrimaryKey(item);

    if (!itemValidation.isSuccess) {
      throw new ValidationFailedException(itemValidation.error);
    }

    const validItem = itemValidation.data;
    const itemValidFromDateRange = resolveDateRangeInSeconds(validItem.validFrom);

    if (!itemValidFromDateRange) {
      throw new InvalidParameterException(
        'validFrom',
        'valid date in ISO 8601 format or Date object',
      );
    }

    const deleted = await this.prisma.usersAddress.deleteMany({
      where: {
        userId: validItem.userId,
        addressType: validItem.addressType,
        validFrom: itemValidFromDateRange,
      },
    });

    if (deleted.count === 0) {
      throw new Error('Address not found or already deleted');
    }

    return true;
  }
}
