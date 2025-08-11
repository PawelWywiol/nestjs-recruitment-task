import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { UsersAddressesController } from './users-addresses.controller';
import { UsersAddressesService } from './users-addresses.service';

@Module({
  controllers: [UsersAddressesController],
  providers: [UsersAddressesService],
  imports: [PrismaModule],
})
export class UsersAddressesModule {}
