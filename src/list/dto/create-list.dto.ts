import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateListDto {
  @ApiProperty({
    description: 'List title.',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  readonly categoryId: number;

  @ApiProperty({
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly draft: boolean;
}
