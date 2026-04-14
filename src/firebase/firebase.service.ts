import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(
          path.resolve(process.cwd(), 'firebase-service-account.json'),
          'utf8'
        )
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const bucket = admin.storage().bucket();
    const filename = `${folder}/${Date.now()}-${file.originalname}`;
    const fileRef = bucket.file(filename);

    await fileRef.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    await fileRef.makePublic();

    return `https://storage.googleapis.com/${bucket.name}/${filename}`;
  }

  async deleteFile(url: string): Promise<void> {
    const bucket = admin.storage().bucket();

    const bucketName = bucket.name;
    const filePath = url
      .replace(`https://storage.googleapis.com/${bucketName}/`, '');

    await bucket.file(filePath).delete();
  }
} 