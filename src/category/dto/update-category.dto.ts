import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

//npmjs.com/package/@nestjs/class-validator/v/0.13.1

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Category name.',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
