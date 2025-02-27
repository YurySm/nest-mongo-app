import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { IdValidatePipe } from '../pipes/id-validate.pipe';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id', IdValidatePipe) id: string,
    @UserEmail() email: string,
  ) {
    console.log(email);
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId', IdValidatePipe) productId: string) {
    return this.reviewService.findByProductId(productId);
  }

  @Delete('byProduct/:productId')
  async deleteByProduct(@Param('productId', IdValidatePipe) productId: string) {
    return this.reviewService.deleteByProductId(productId);
  }
}
