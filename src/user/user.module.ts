import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { FirebaseApp } from '../Firebase/firebase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    FirebaseApp,
    UserRepository,
    { provide: 'UserRepositoryInterface', useClass: UserRepository },
  ],
})
export class UserModule {}
