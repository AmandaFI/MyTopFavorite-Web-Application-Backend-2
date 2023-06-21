import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany();
  }

  find(categoryId: Category['id']) {
    return this.prisma.category.findFirst({ where: { id: categoryId } });
  }

  create(data: CreateCategoryDto) {
    return this.prisma.category.create({ data: { ...data } });
  }

  update(categoryId: Category['id'], data: CreateCategoryDto) {
    return this.prisma.category.update({
      where: { id: categoryId },
      data: { ...data },
    });
  }

  delete(categoryId: Category['id']) {
    return this.prisma.category.delete({ where: { id: categoryId } });
  }
}
