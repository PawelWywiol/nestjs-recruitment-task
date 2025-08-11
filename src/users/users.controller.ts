/** biome-ignore-all lint/nursery/useExplicitType: not required */
import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
import { UserEntity } from './entities/user.entity';
import { DEFAULT_USERS_PAGE_INDEX } from './users.config';
// biome-ignore lint/style/useImportType: NestJS DI requires importing the actual class, not just the type
import { UsersService } from './users.service';

import { ErrorResponseDto } from '../errorHandler/dto/error-response.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of users' })
  @ApiQuery({
    name: 'page',
    description: 'Page number (starts from 1)',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    type: PaginatedUsersResponseDto,
    description: 'Returns paginated list of users',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Invalid page parameter',
  })
  findAll(
    @Query('page', new DefaultValuePipe(DEFAULT_USERS_PAGE_INDEX), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    type: UserEntity,
    description: 'Returns a user by ID',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'User with the specified ID was not found',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Invalid ID parameter',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
