import {IsNotEmpty, IsNumber, IsString, MaxLength} from "class-validator";


export class CommentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    comment: string
    @IsNotEmpty()
    @IsNumber()
    postId:number
}