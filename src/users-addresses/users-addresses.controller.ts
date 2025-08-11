/** biome-ignore-all lint/nursery/useExplicitType: not required */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { PaginatedUsersAddressesResponseDto } from './dto/paginated-users-addresses-response.dto';
import { CreateUserAddressDto, UserAddressPrimaryKeyDto } from './dto/user-address.dto';
import { UsersAddressEntity } from './entities/users-address.entity';
import { DEFAULT_USER_ADDRESS, USERS_ADDRESSES_PER_PAGE } from './users-addresses.config';
// biome-ignore lint/style/useImportType: NestJS DI requires importing the actual class, not just the type
import { UsersAddressesService } from './users-addresses.service';

import { ErrorResponseDto } from '../errorHandler/dto/error-response.dto';

@Controller('users-addresses')
@ApiTags('users-addresses')
export class UsersAddressesController {
  constructor(private readonly usersAddressesService: UsersAddressesService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get paginated list of user addresses' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number (starts from 1)',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    type: PaginatedUsersAddressesResponseDto,
    description: 'Returns paginated list of user addresses',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Invalid parameters',
  })
  findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersAddressesService.findAll(userId, page, USERS_ADDRESSES_PER_PAGE);
  }

  @Post()
  @ApiOperation({ summary: 'Create or update user address' })
  @ApiBody({
    type: CreateUserAddressDto,
    description: 'User address data',
  })
  @ApiCreatedResponse({
    type: UsersAddressEntity,
    description: 'User address successfully created/updated',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Invalid address data',
  })
  upsert(@Body() createUserAddressDto: CreateUserAddressDto) {
    const itemPrimaryKey = {
      ...DEFAULT_USER_ADDRESS,
      userId: createUserAddressDto.userId,
      addressType: createUserAddressDto.addressType,
      validFrom: createUserAddressDto.validFrom,
    };

    return this.usersAddressesService.upsert(itemPrimaryKey, createUserAddressDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user address' })
  @ApiBody({
    type: UserAddressPrimaryKeyDto,
    description: 'User address primary key data',
  })
  @ApiOkResponse({
    type: Boolean,
    description: 'Returns true if address was successfully deleted',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Invalid parameters',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Address not found',
  })
  delete(@Body() userAddressPrimaryKeyDto: UserAddressPrimaryKeyDto) {
    const addressToDelete = {
      ...DEFAULT_USER_ADDRESS,
      ...userAddressPrimaryKeyDto,
    };

    return this.usersAddressesService.delete(addressToDelete);
  }
}
