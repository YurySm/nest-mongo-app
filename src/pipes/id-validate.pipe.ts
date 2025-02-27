import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { Types } from 'mongoose';

export class IdValidatePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      return value;
    }
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Не правильный ID');
    }
    return value;
  }
}
