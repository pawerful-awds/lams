import admin from 'firebase-admin';
// import { Storage } from '@google-cloud/storage';

import { env } from '@/common/utils/envConfig';

const servicePrivateKey = Buffer.from(env.FIREBASE_SERVICE_PRIVATE_KEY || '', 'base64').toString();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: `${env.FIREBASE_PROJECT_ID}`,
    clientEmail: `${env.FIREBASE_CLIENT_EMAIL}`,
    privateKey: servicePrivateKey.replace(/\\n/g, '\n'),
  }),
  storageBucket: `${env.FIREBASE_PROJECT_ID}.appspot.com`,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { db, bucket, admin };
