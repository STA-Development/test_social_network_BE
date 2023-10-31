import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsString()
  picture: string;
  @IsString()
  uId: string;
}
