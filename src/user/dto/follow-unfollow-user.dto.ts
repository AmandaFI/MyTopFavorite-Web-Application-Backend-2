import { IsInt } from 'class-validator';

export class FollowUnfollowUserDto {
  @IsInt()
  readonly userId: number;
}

// https://www.npmjs.com/package/class-validator
// https://dev.to/sarathsantoshdamaraju/nestjs-and-class-validator-cheat-sheet-13ao
