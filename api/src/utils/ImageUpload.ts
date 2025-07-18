import fs from "fs";
import path from "path";

export function moveUploadedFile(tempFilePath: string, destinationDir: string): Promise<string> {
    return new Promise((resolve, reject) => {
      
      const fileName = path.basename(tempFilePath);
      const destinationPath = path.join(destinationDir, fileName);
      if (!fs.existsSync(destinationDir)) {
        try {
          fs.mkdirSync(destinationDir, { recursive: true });
        } catch (error) {
          return reject(error);
        }
      }
      fs.rename(tempFilePath, destinationPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(destinationPath);
        }
      });
    });
  }