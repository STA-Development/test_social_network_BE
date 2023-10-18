import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { ReqUser } from '../dto/user.dto/users.dto';

@Controller('userAuth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('verifyUser')
  create(@Req() request: Request): Promise<ReqUser> {
    return this.authService.getUserInfo(request);
  }
}
