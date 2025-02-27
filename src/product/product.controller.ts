import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindProductDto } from './dto/find-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { IdValidatePipe } from '../pipes/id-validate.pipe';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidatePipe) id: string) {
    const product = await this.productService.getById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidatePipe) id: string) {
    const product = await this.productService.delete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(
    @Param('id', IdValidatePipe) id: string,
    @Body() dto: CreateProductDto,
  ) {
    const product = await this.productService.updateProduct(id, dto);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto);
  }
}
