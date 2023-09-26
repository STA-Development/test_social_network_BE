import {IsString} from "class-validator";


export class User{
    @IsString()
    userIdToken: string
}