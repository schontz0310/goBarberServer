import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  uploadsFolder: string;

  tmpFolder: string;

  multer: {
    storage: StorageEngine;
  };

  driver: 's3' | 'disk';

  config: {
    disk: null;
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename: (request, file, callback) => {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;
        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: null,
    aws: {
      bucket: 'ags-gobarber',
    },
  },
} as IUploadConfig;
