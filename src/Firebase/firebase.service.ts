import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { v4 as uuid } from 'uuid';
import * as process from 'process';
import { ConfigService } from '@nestjs/config';

const { getStorage, getDownloadURL } = require('firebase-admin/storage');

@Injectable()
export class FirebaseApp {
  private firebaseApp: firebase.app.App;
  constructor(private configService: ConfigService) {
    if (!firebase.apps.length) {
      const firebase_params: object = {
        type: configService.get<string>('TYPE'),
        project_id: configService.get<string>('PROJECT_ID'),
        private_key_id: configService.get<string>('PRIVATE_KEY_ID'),
        private_key: configService
          .get<string>('PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
        client_email: configService.get<string>('CLIENT_EMAIL'),
        client_id: configService.get<string>('CLIENT_ID'),
        auth_uri: configService.get<string>('AUTH_URI'),
        token_uri: configService.get<string>('TOKEN_URI'),
        auth_provider_x509_cert_url: configService.get<string>(
          'AUTH_PROVIDER_X509_CER_URL',
        ),
        client_x509_cert_url: configService.get<string>('CLIENT_X509_CERT_URL'),
        universe_domain: configService.get<string>('UNIVERSE_DOMAIN'),
      };
      this.firebaseApp = firebase.initializeApp({
        credential: firebase.credential.cert(firebase_params),
        databaseURL: process.env.DATABASE_URL,
        storageBucket: process.env.STORAGE_BUCKET,
      });
    } else {
      this.firebaseApp = firebase.apps[0];
    }
  }
  getAuth = (): firebase.auth.Auth => {
    return this.firebaseApp.auth();
  };
  async userProfileUpdate(uId: string, url: string) {
    const auth = this.getAuth();
    await auth.updateUser(uId, {
      photoURL: url,
    });
  }
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const storage = firebase.storage();
    const bucket = storage.bucket();
    const bucketName = 'testproject-258d3.appspot.com';
    const uniqueFileName = `${uuid()}_${file.originalname}`;
    const BucketFile = bucket.file(uniqueFileName);
    const fileStream = BucketFile.createWriteStream();
    await new Promise<string>((res, rej) => {
      fileStream
        .on('finish', () => {
          res(`gs://${bucketName}/${uniqueFileName}`);
        })
        .on('error', (error) => {
          rej(error);
        })
        .end(file.buffer);
    });
    const fileRef = getStorage().bucket(bucketName).file(uniqueFileName);
    return getDownloadURL(fileRef);
  }
  async deleteFile(url: string): Promise<void> {
    if (
      url.split('/')[2] !== 'lh3.googleusercontent.com' &&
      url.split('/')[1] !== 'butman.png'
    ) {
      const fileName = url.split('/')[7].split('?')[0];
      const bucket = this.firebaseApp.storage().bucket();
      const file = bucket.file(fileName);
      if (file) {
        try {
          await file.delete();
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
        }
      }
    }
  }
}
