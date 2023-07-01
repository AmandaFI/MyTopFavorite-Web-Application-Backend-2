import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsInt()
  @IsNotEmpty()
  readonly categoryId: number;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly draft: boolean;
}
