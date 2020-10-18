export default interface IStorageProvider {
  saveFile(file: string): Promise<string>;
  deleteFile(File: string): Promise<void>;
}
