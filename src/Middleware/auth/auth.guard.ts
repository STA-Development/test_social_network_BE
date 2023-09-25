import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as firebase from 'firebase-admin';
import * as serviceAccount from './firebaseConfig.json';
// import { initializeApp } from 'firebase-admin/app';
//
// const app = initializeApp();
// console.log(serviceAccount);
const firebase_params: object = {
  type: serviceAccount.type,
  project_id: serviceAccount.project_id,
  private_key_id: serviceAccount.private_key_id,
  private_key: serviceAccount.private_key,
  client_email: serviceAccount.client_email,
  client_id: serviceAccount.client_id,
  auth_uri: serviceAccount.auth_uri,
  token_uri: serviceAccount.token_uri,
  auth_provider_x509_cert_url: serviceAccount.client_x509_cert_url,
  client_x509_cert_url: serviceAccount.client_x509_cert_url,
  universe_domain: serviceAccount.universe_domain,
};
@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  private defaultApp: any;
  constructor() {
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params),
      databaseURL: 'https://testproject-258d3.firebaseio.com',
    });
  }
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    const token = req.headers.authorization;
    // console.log(token);
    if (token != null && token != '') {
      // console.log(token);
      this.defaultApp
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          // console.log(decodedToken);
          const user: object = {
            name: decodedToken.name,
            email: decodedToken.email,
            picture: decodedToken.picture,
            user_id: decodedToken.user_id,
          };
          req['user'] = user;
          next();
        })
        .catch((error): void => {
          console.error(error);
          this.accessDenied(req.url, res);
        });
    } else {
      next();
    }
  }
  private accessDenied(url: string, res: Response): void {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied',
    });
  }
}
