import { Injectable } from '@nestjs/common';

import { GET_USERS_PAYLOAD, USERS_PER_PAGE } from './users.config';

import {
  InvalidParameterException,
  ResourceNotFoundException,
} from '../errorHandler/exceptions/custom-exceptions';
// biome-ignore lint/style/useImportType: NestJS DI requires importing the actual class, not just the type
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, itemsPerPage = USERS_PER_PAGE) {
    if (!Number.isInteger(page) || page <= 0) {
      throw new InvalidParameterException('page', 'positive integer');
    }

    if (!Number.isInteger(itemsPerPage) || itemsPerPage <= 0) {
      throw new InvalidParameterException('itemsPerPage', 'positive integer');
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
        orderBy: {
          createdAt: 'desc',
        },
        ...GET_USERS_PAYLOAD,
      }),
      this.prisma.user.count(),
    ]);

    return { items, page, pages: Math.ceil(total / itemsPerPage) };
  }

  async findOne(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new InvalidParameterException('id', 'positive integer');
    }

    const item = await this.prisma.user.findUnique({
      where: { id },
      ...GET_USERS_PAYLOAD,
    });

    if (!item) {
      throw new ResourceNotFoundException('User', id);
    }

    return item;
  }
}
