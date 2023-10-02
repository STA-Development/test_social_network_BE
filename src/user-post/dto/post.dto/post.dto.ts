import {IsNotEmpty, IsNumber, IsString, MaxLength} from 'class-validator';
export class PostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  title: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;
  @IsString()
  userId: string
}