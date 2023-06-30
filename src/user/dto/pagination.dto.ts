import { IsInt, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @IsOptional()
  readonly page: number;

  @IsInt()
  @IsOptional()
  readonly perPage: number;
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
