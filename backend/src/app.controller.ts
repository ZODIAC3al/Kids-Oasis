import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      status: 'ok',
      service: 'Kids Oasis Enterprise API',
      version: '1.0.0',
      description: 'Education marketplace & nursery platform backend',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      service: 'Kids Oasis Enterprise API',
      timestamp: new Date().toISOString(),
    };
  }
}
