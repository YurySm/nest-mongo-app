import { Injectable } from '@nestjs/common';
import { Review, ReviewDocument } from './review.model';
import { Document, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async create(dto: CreateReviewDto): Promise<Document<Review>> {
    return this.reviewModel.create(dto);
  }

  async delete(id: string): Promise<Document<Review> | null> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async findByProductId(productId: string): Promise<Document<Review>[]> {
    return this.reviewModel.find({ productId }).exec();
  }

  async deleteByProductId(productId: string) {
    return this.reviewModel.deleteMany({ productId }).exec();
  }
}
