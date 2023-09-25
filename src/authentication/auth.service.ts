import { Injectable, Post } from '@nestjs/common';

@Injectable()
export class AuthService {
  @Post('verifyUser')
  getUserInfo(request: Request): Request {
    return request['user'] ? request['user'] : '';
  }
}
