import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'E-mail can not be empty.' })
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name: string;
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
