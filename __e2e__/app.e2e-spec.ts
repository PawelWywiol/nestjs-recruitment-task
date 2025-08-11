import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
// biome-ignore lint/performance/noNamespaceImport: Required for supertest tests
import * as request from 'supertest';
import type { App } from 'supertest/types';

import { SUCCESS_RESPONSE_CODE, SUCCESS_RESPONSE_TEXT } from './app.e2e.config';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(SUCCESS_RESPONSE_CODE)
      .expect(SUCCESS_RESPONSE_TEXT);
  });
});
