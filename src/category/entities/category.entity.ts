import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { Exclude } from 'class-transformer';

//https://docs.nestjs.com/techniques/serialization

export class CategoryEntity implements Category {
  @ApiProperty() id: number;
  @ApiProperty() name: string;

  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
