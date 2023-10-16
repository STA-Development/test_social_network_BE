import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as serviceAccount from './firebaseConfig.json';
import { v4 as uuid } from 'uuid';

const { getStorage, getDownloadURL } = require('firebase-admin/storage');

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
export class FirebaseApp {
  private firebaseApp: firebase.app.App;
  constructor() {
    if (!firebase.apps.length) {
      this.firebaseApp = firebase.initializeApp({
        credential: firebase.credential.cert(firebase_params),
        databaseURL: 'https://testproject-258d3.firebaseio.com',
        storageBucket: 'gs://testproject-258d3.appspot.com',
      });
    } else {
      this.firebaseApp = firebase.apps[0];
    }
  }
  getAuth = (): firebase.auth.Auth => {
    // console.log(this.firebaseApp);
    return this.firebaseApp.auth();
  };
  async uploadFile(photo): Promise<string> {
    const storage = firebase.storage();
    const bucket = storage.bucket();
    const bucketName = 'testproject-258d3.appspot.com';
    const uniqeFileName = `${uuid()}_${photo.originalname}`;
    const file = bucket.file(uniqeFileName);
    // const fileStream = file.createWriteStream();//this will overwrite existing file
    const fileStream = file.createWriteStream();
    await new Promise<string>((res, rej) => {
      fileStream
        .on('finish', () => {
          res(`gs://${bucketName}/${uniqeFileName}`);
        })
        .on('error', (error) => {
          rej(error);
        })
        .end(photo.buffer);
    });
    const fileRef = getStorage().bucket(bucketName).file(uniqeFileName);
    return getDownloadURL(fileRef);
  }
}
