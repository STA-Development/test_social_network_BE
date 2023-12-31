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

@Module({
  imports: [],
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
