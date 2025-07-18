import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import crypto from 'crypto';

export async function downloadImage(imageUrl: string): Promise<{filePath: string, fileName: string}> {
    try {
      const fileExtension = '.jpg'; 
      const fileName = `${crypto.randomBytes(8).toString('hex')}${fileExtension}`;
      const dirPath = path.join('public', 'temp');
      const filePath = path.join(dirPath, fileName);
      
      // Make sure the directory exists
      if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // Download the image
      const response = await axios({
        method: 'GET',
        url: imageUrl,
        responseType: 'stream'
      });
      
      // Create a write stream and pipe the image data to it
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      
      // Return a promise that resolves when the download is complete
      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          resolve({
            filePath,
            fileName
          });
        });
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('Error downloading profile picture:', error);
      throw error;
    }
  }