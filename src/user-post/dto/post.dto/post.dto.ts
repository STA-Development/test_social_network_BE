import { IsString } from 'class-validator'; // npm i class-validator
export class PostDto {
  // @IsNumber()
  // id: number;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  photo: string;
}
