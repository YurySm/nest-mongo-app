import { Document, HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class HhData {
  @Prop()
  count: number;

  @Prop()
  juniorSalary: number;

  @Prop()
  middleSalary: number;

  @Prop()
  seniorSalary: number;
}

export class TopPageAdvantage {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

export type TopPageDocument = HydratedDocument<TopPage>;

@Schema({ timestamps: true })
export class TopPage extends Document {
  @Prop({ enum: TopLevelCategory })
  firstCategory: TopLevelCategory;

  @Prop()
  secondCategory: string;

  @Prop({ unique: true })
  alias: string;

  @Prop({ index: true })
  title: string;

  @Prop()
  category: string;

  @Prop({ type: HhData })
  hh?: HhData;

  @Prop({ type: [TopPageAdvantage] })
  advantages: TopPageAdvantage[];

  @Prop()
  seoText: string;

  @Prop()
  tagsTitle: string;

  @Prop([String])
  tags: string[];

  @Prop()
  createdAd: Date;

  @Prop()
  updatedAt?: Date;
}

const TopPageSchema = SchemaFactory.createForClass(TopPage);
TopPageSchema.index({ title: 1 });
TopPageSchema.index({ seoText: 1 });
// Создание индекса на поле 'title' внутри объектов массива 'advantages'
TopPageSchema.index({ 'advantages.title': 'text' });
// TopPageSchema.index({ '$**': 1 });
export { TopPageSchema };
