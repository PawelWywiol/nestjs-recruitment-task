import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Use your imagination! or check the API documentation at /api';
  }
}
