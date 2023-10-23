import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserCommentController } from './controllers/user-comment.controller';
import { UserCommentService } from './service/user-comment.service';
import { FirebaseApp } from '../Firebase/firebase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../user-post/entities/Post.entity';
import { User } from '../authentication/entities/user.entity';
import { PreAuthMiddleware } from '../Middleware/auth/auth.guard';
import { Comments } from './entities/Comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, User, Comments])],
  controllers: [UserCommentController],
  providers: [UserCommentService, FirebaseApp],
})
export class UserCommentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreAuthMiddleware)
      .exclude({
        path: '/comment/getAll/:postId',
        method: RequestMethod.GET,
      })
      .forRoutes(UserCommentController);
  }
}
