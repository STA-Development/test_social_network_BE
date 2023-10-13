import {MiddlewareConsumer, Module, NestModule, RequestMethod,} from '@nestjs/common';
import {PostController} from './post-controller/post-controller.controller';
import {PostService} from './service/post/post.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Posts} from './entities/Post.entity';
import {PreauthMiddleware} from '../Middleware/auth/auth.guard';
import {FirebaseApp} from '../Firebase/firebase.service';
import {User} from "../authentication/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Posts,User])],
  controllers: [PostController],
  providers: [PostService, FirebaseApp],
})
export class UserPostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreauthMiddleware)
      .exclude({
        path: '/post/getAllPosts',
        method: RequestMethod.GET
        },
          {
            path: 'post/getAllPostsLength',
            method: RequestMethod.GET
          },
          {
            path: 'post/getAllPosts/:length',
            method: RequestMethod.GET
          }
      )
      .forRoutes(PostController);
  }
}
