import { IsString } from 'class-validator';

export class ReqUser {
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsString()
  picture: string;
  @IsString()
  user_id: string;
}
