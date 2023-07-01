import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateListItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Title can not be empty.' })
  readonly title: string;

  @IsString()
  @IsNotEmpty({ message: 'User comment can not be empty.' })
  readonly userComment: string;

  @IsString()
  @IsNotEmpty({ message: 'API Identifier can not be empty.' })
  readonly externalApiIdentifier: string;

  @IsInt()
  readonly rank: number;

  @IsInt()
  readonly listId: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Details can not be empty.' })
  readonly details: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Image URL can not be empty.' })
  readonly imageUrl: string;
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
