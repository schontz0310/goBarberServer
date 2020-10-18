import { container } from 'tsyringe';
import IStorageprovider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import DiskStorageprovider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

container.registerSingleton<IStorageprovider>(
  'StorageProvider',
  DiskStorageprovider,
);
