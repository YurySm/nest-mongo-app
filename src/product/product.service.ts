import { Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindProductDto } from './dto/find-product.dto';
import { Review } from '../review/review.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

  async getById(id: string) {
    return this.productModel.findById(id).exec();
  }

  async delete(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateProduct(id: string, dto: CreateProductDto) {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findWithReviews(dto: FindProductDto) {
    return this.productModel
      .aggregate([
        {
          $match: {
            // выборка
            categories: dto.category, // categories из модели
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $lookup: {
            // подтягивание данных из другой коллекции(таблицы)
            from: 'reviews',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewsCount: {
              $size: '$reviews',
            },
            reviewAvg: {
              $avg: '$reviews.rating',
            },
            reviews: {
              $function: {
                body: `function (reviews) {
                  return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
                }`,
                args: ['$reviews'],
                lang: 'js',
              },
            },
          },
        },
      ])
      .exec();
  }
}
