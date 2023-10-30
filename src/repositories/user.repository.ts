import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { User } from '../user/entities/user.entity';
import { UserRepositoryInterface } from '../user/interface/user.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
  async checkUserExist(uId: string): Promise<boolean> {
    const option = {
      where: {
        userIdToken: uId,
      },
    };
    const isExist: boolean = await this.exist(option);
    return isExist;
  }
  async updateUserCredential(uId: string, url: string) {
    try {
      await this.update(
        {
          userIdToken: uId,
        },
        {
          picture: url,
        },
      );
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
