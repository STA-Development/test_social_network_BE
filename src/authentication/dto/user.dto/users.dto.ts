import {IsNumber, IsString} from "class-validator";


export class Users{
    @IsNumber()
    id: number;
    @IsString()
    userName: string;
    @IsString()
    picture: string;
    @IsString()
    userIdToken: string;
}