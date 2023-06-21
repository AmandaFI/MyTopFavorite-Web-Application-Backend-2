import { Category } from '@prisma/client';
import { Exclude } from 'class-transformer';

//https://docs.nestjs.com/techniques/serialization

export class CategoryEntity implements Category {
  id: number;
  name: string;

  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
