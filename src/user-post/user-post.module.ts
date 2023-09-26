import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostController } from './post-controller/post-controller.controller';
import { PostService } from './service/post/post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/Post.entity';
import { PreauthMiddleware } from '../Middleware/auth/auth.guard';
import { FirebaseApp } from '../Firebase/firebase.service';
import {User} from "../authentication/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Post,User])],
  controllers: [PostController],
  providers: [PostService, FirebaseApp],
})
export class UserPostModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(PreauthMiddleware)
      .exclude(
        {
          path: 'post/createPost',
          method: RequestMethod.ALL,
        },
        {
          path: 'post/getPosts',
          method: RequestMethod.ALL,
        },
      )
      .forRoutes(PostController);
  }
}
