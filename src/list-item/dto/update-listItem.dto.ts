import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateListItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Title can not be empty.' })
  @IsOptional()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'User comment can not be empty.' })
  @IsOptional()
  readonly userComment: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'API Identifier can not be empty.' })
  @IsOptional()
  readonly externalApiIdentifier: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  readonly rank: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Details can not be empty.' })
  readonly details: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Image URL can not be empty.' })
  readonly imageUrl: string;
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
