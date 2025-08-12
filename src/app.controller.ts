import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// biome-ignore lint/style/useImportType: NestJS DI requires importing the actual class, not just the type
import { AppService } from './app.service';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiTags('Health')
  @ApiOkResponse({ description: 'Service is healthy' })
  @Get('health')
  healthCheck(): { status: string } {
    return { status: 'ok' };
  }
}
