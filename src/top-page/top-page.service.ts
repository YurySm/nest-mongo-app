import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TopLevelCategory, TopPage, TopPageDocument } from './top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService implements OnModuleInit {
  constructor(
    @InjectModel(TopPage.name)
    private readonly topPageModel: Model<TopPageDocument>,
  ) {}

  async onModuleInit() {
    // const collection = this.topPageModel.collection;
    // //
    // // // Удаление всех индексов
    // await collection.dropIndexes();

    await this.topPageModel.syncIndexes(); // Обновление индексов

    // console.log(await this.topPageModel.collection.getIndexes());
  }

  async create(dto: CreateTopPageDto) {
    return this.topPageModel.create(dto);
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  // async findByCategory(firstCategory: TopLevelCategory) {
  //   return this.topPageModel
  //     .find({ firstCategory }, { alias: 1, title: 1, secondCategory: 1 })
  //     .exec();
  // }

  // async findByCategory(firstCategory: TopLevelCategory) {
  //   return this.topPageModel
  //     .aggregate([
  //       {
  //         $match: {
  //           firstCategory,
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: { secondCategory: '$secondCategory' },
  //           pages: {
  //             $push: {
  //               alias: '$alias',
  //               title: '$title',
  //             },
  //           },
  //         },
  //       },
  //     ])
  //     .exec();
  // }

  async findByCategory(firstCategory: TopLevelCategory) {
    return this.topPageModel
      .aggregate()
      .match({
        firstCategory,
      })
      .group({
        _id: { secondCategory: '$secondCategory' },
        pages: {
          $push: {
            alias: '$alias',
            title: '$title',
          },
        },
      })
      .exec();
  }

  async findByText(text: string) {
    return this.topPageModel
      .find({
        $text: {
          $search: text,
          $caseSensitive: false,
        },
      })
      .exec();
  }

  async deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
}
