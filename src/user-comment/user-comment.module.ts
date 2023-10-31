import { Module } from '@nestjs/common';
import { UserCommentController } from './controllers/user-comment.controller';
import { UserCommentService } from './service/user-comment.service';
import { FirebaseApp } from '../Firebase/firebase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../user-post/entities/Post.entity';
import { User } from '../user/entities/user.entity';
import { Comments } from './entities/Comments.entity';
import { CommentsRepository } from '../repositories/comments.repository';
import { UserRepository } from '../repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, User, Comments])],
  controllers: [UserCommentController],
  providers: [
    UserCommentService,
    FirebaseApp,
    CommentsRepository,
    UserRepository,
    { provide: 'CommentsRepositoryInterface', useClass: CommentsRepository },
    { provide: 'UserRepositoryInterface', useClass: UserRepository },
  ],
})
export class UserCommentModule {}
