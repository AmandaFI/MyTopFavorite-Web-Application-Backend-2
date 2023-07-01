import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateListDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly title: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly draft: boolean;
}
