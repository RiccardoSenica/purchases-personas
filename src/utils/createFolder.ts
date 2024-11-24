import { promises as fs } from 'fs';

export async function createFolderIfNotExists(
  folderPath: string
): Promise<void> {
  try {
    await fs.access(folderPath);
    console.log('Folder already exists');
  } catch {
    try {
      await fs.mkdir(folderPath, { recursive: true });
      console.log('Folder created successfully');
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }
}
