import { Controller, Get, Req } from '@nestjs/common';
// import { AppService } from './app.service';

@Controller('post')
export class AppController {
  // constructor(private appService: AppService) {}
  @Get()
  getHello(@Req() request: Request): string {
    return 'hello ' + request['user']?.email + '!';
  }
}
