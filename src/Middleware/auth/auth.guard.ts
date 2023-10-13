import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as firebase from 'firebase-admin';
import { FirebaseApp } from '../../Firebase/firebase.service';
import { auth } from 'firebase-admin';
import UserRecord = auth.UserRecord;

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  private auth: firebase.auth.Auth;
  constructor(private firebaseApp: FirebaseApp) {
    this.auth = firebaseApp.getAuth();
  }
  async use(req: Request, res: Response, next: NextFunction) {
    // console.log('Request...');
    const token = req.headers.authorization;
    if (token !== null && token !== '') {
      // console.log(token);
      try {
        const decodedToken = await this.auth.verifyIdToken(
          token.replace('Bearer ', ''),
        );
        console.log(decodedToken);
        const authUserInfo: UserRecord = await firebase
          .auth()
          .getUser(decodedToken.uid);
        req['user'] = {
          name: authUserInfo.displayName,
          email: authUserInfo.email,
          picture: authUserInfo.photoURL,
          user_id: authUserInfo.uid,
        };
        next();
      } catch (error) {
        console.error(error);
        this.accessDenied(req.url, res);
      }
    } else {
      this.accessDenied(req.url, res);
    }
  }
  private accessDenied(url: string, res: Response): void {
    console.log(url);
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied',
    });
  }
}
