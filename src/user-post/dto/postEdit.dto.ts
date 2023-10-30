import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EditPostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  data: string;
}
