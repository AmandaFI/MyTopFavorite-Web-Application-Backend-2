import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsInt()
  @IsOptional()
  readonly page: number;

  @ApiProperty({
    required: false,
  })
  @IsInt()
  @IsOptional()
  readonly perPage: number;
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
