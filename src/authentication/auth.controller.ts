import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('userAuth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('verifyUser')
  create(@Req() request: Request): Request {
    console.log(request['user'].displayName);
    return this.authService.getUserInfo(request);
  }
}
