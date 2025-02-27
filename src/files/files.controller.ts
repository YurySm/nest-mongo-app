import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileElementResponse } from './dto/files.response';
import { MFile } from './MFile';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    const saveArr: MFile[] = [file];
    if (file.mimetype.includes('image')) {
      const webp = await this.filesService.convertToWebP(file.buffer);
      // saveArr.push({
      //   originalname: `${file.originalname.split('.')[0]}.webp`,
      //   buffer: webp,
      // });
      saveArr.push(
        new MFile({
          originalname: `${file.originalname.split('.')[0]}.webp`,
          buffer: webp,
        }),
      );
    }
    return this.filesService.saveFiles(saveArr);
  }
}
