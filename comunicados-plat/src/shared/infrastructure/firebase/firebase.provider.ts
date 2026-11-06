import { Provider } from '@nestjs/common';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

export const FIREBASE_MESSAGING = 'FIREBASE_MESSAGING';

export const FirebaseMessagingProvider: Provider = {
  provide: FIREBASE_MESSAGING,
  useFactory: () => {
    if (getApps().length > 0) {
      return getMessaging(getApps()[0]);
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    let credential;
    if (credPath) {
      const fullPath = resolve(process.cwd(), credPath);
      if (existsSync(fullPath)) {
        try {
          const serviceAccount = JSON.parse(readFileSync(fullPath, 'utf8'));
          credential = cert(serviceAccount);
        } catch (e) {
          console.warn('⚠️ No se pudo leer el archivo de credenciales de Firebase como JSON:', e);
        }
      }
    }

    const app = initializeApp({
      credential: credential ?? applicationDefault(),
      projectId,
    });

    return getMessaging(app);
  },
};

