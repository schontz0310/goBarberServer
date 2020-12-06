import { container } from 'tsyringe';
import IStorageprovider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import DiskStorageprovider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

container.registerSingleton<IStorageprovider>(
  'StorageProvider',
  DiskStorageprovider,
);
