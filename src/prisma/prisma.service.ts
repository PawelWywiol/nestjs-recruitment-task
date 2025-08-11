import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
// biome-ignore lint/style/useImportType: NestJS DI requires importing the actual class
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import type { JsPromise } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit(): JsPromise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): JsPromise<void> {
    await this.$disconnect();
  }
}
