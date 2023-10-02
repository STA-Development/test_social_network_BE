import {
  Body,
  Controller, FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {PostDto} from '../dto/post.dto/post.dto';
import { PostService } from '../service/post/post.service';
import {Posts} from "../entities/Post.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import {FirebaseApp} from "../../Firebase/firebase.service";

@Controller('post')
export class PostController {
  constructor(private postService: PostService, private firebase: FirebaseApp) {}
  @Post('createPost')
    @UseInterceptors(FileInterceptor('photo'))
  create(@Body() postFormData:PostDto, @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5999999 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
  ) photo: Express.Multer.File) {
    return this.postService.createPost(postFormData, photo);
  }
  @Get('/userPosts/:userId')
  getPosts(@Param('userId') userId: string):Promise<Posts[]> {
    return this.postService.getPosts(userId)
  }
  @Get('/getAllPosts')
   getAllPosts(): Promise<Posts[]>{
    console.log('...get all posts')
    return this.postService.getAllPosts()
  }
  @Get('/getAllPosts/:length')
  getMorePosts(@Param('length') length: number):Promise<Posts[]>{
    return this.postService.getMorePosts(length)
  }
  @Get('/getUserAllPosts/:length/:uId')
  getMoreUserPosts(@Param('length') length: number, @Param('uId') uId: string ):Promise<Posts[]>{
    console.log(length)
    return this.postService.getMoreUserPosts(length,uId)
  }
}
