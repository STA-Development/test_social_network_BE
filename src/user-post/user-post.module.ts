import { Module } from '@nestjs/common';
import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/Post.entity';
import { FirebaseApp } from '../Firebase/firebase.service';
import { User } from '../user/entities/user.entity';
import { PostRepository } from '../repositories/post.repository';
import { UserRepository } from '../repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, User])],
  controllers: [PostController],
  providers: [
    PostService,
    FirebaseApp,
    PostRepository,
    UserRepository,
    { provide: 'PostRepositoryInterface', useClass: PostRepository },
    { provide: 'UserRepositoryInterface', useClass: UserRepository },
  ],
})
export class UserPostModule {}
