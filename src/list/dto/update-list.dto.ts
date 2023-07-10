import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateListDto {
  @ApiProperty({
    description: 'List title.',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly title: string;

  @ApiProperty({
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly draft: boolean;
}
