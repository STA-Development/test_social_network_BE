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
  @IsString()
  userId: string
}
export class transferPostDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  photo: string;
  @IsString()
  userId: number
}


export class getPost{
  userId: string
}