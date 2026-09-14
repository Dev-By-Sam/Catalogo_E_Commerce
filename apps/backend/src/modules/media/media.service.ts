import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface UploadedFileDto {
  filename: string;
  size: number;
  [key: string]: any;
}

@Injectable()
export class MediaService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  saveUploadedFile(file: UploadedFileDto): { url: string; filename: string; size: number } {
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
    };
  }
}
