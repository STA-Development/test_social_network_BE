import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('userAuth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('verifyUser')
  create(@Req() request: Request): object {
    return this.authService.getUserInfo(request);
  }
}
