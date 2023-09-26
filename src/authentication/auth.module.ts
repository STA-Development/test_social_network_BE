import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PreauthMiddleware } from '../Middleware/auth/auth.guard';
import { FirebaseApp } from '../Firebase/firebase.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "../user-post/entities/Post.entity";
import {User} from "./entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, FirebaseApp],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(PreauthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
