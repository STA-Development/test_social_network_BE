import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { FirebaseApp } from '../../Firebase/firebase.service';
import { auth } from 'firebase-admin';
import UserRecord = auth.UserRecord;

@Injectable()
export class AuthGuard implements CanActivate {
  private auth: firebase.auth.Auth;

  constructor(private readonly firebaseApp: FirebaseApp) {
    this.auth = firebaseApp.getAuth();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException();
    }
    try {
      const token = authHeader.replace('Bearer ', '');
      const decodedToken = await this.auth.verifyIdToken(
        token.replace('Bearer ', ''),
      );
      const authUserInfo: UserRecord = await firebase
        .auth()
        .getUser(decodedToken.uid);
      request.user = {
        name: authUserInfo.displayName,
        email: authUserInfo.email,
        picture: authUserInfo.photoURL,
        uId: authUserInfo.uid,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
