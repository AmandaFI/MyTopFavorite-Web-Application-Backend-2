import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserNameDto {
  @ApiProperty()
  @IsString()
  readonly name: string;
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
