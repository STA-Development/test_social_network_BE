import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ReqUser } from '../dto/user.dto/users.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async getUserInfo(request: Request): Promise<ReqUser> {
    const User: User[] = await this.userRepository.findBy({
      userIdToken: request['user'].user_id,
    });
    if (!User.length) {
      const newUser: User = this.userRepository.create({
        userIdToken: request['user'].user_id,
        userName: request['user'].name,
        picture: request['user'].picture,
      });
      await this.userRepository.save(newUser);
    }
    return request['user'] ? request['user'] : '';
  }
}
