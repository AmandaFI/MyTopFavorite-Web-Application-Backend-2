import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthenticateUserGuard } from 'src/authorization/guards/authenticate.guard';
import { Category } from '@prisma/client';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('api/categories')
@UseGuards(AuthenticateUserGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async index() {
    const categories = await this.categoryService.findAll();

    return categories.map((category) => this.serialize(category));
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.find(id);

    if (!category) throw new NotFoundException();

    return this.serialize(category);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateCategoryDto) {
    const category = await this.categoryService.create(data);

    return this.serialize(category);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.delete(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.update(id, data);

    return this.serialize(category);
  }

  private serialize(category: Category) {
    return new CategoryEntity(category);
  }
}
