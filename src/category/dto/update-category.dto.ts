import { IsNotEmpty, IsString } from 'class-validator';

//npmjs.com/package/@nestjs/class-validator/v/0.13.1

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
