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
import {getPost, PostDto, transferPostDto} from '../dto/post.dto/post.dto';
import { PostService } from '../service/post/post.service';
import {Posts} from "../entities/Post.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import {FirebaseApp} from "../../Firebase/firebase.service";

@Controller('post')
export class PostController {
  constructor(private postService: PostService, private firebase: FirebaseApp) {}
  @Post('createPost')
    @UseInterceptors(FileInterceptor('photo'))
  create(@Body() postFormData: PostDto, @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5999999 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
  ) photo: Express.Multer.File) {
    return this.postService.createPost(postFormData, photo);
  }


  // async create(@Body() post: PostDto): Promise<transferPostDto> {
  //   console.log(post);
  //   return await this.postService.createPost(post);
  // }
  @Get('/userPosts/:userId')
  async getPosts(@Param('userId') userId: string) {
    console.log("...get user Posts:")
    return await this.postService.getPosts(userId)
  }
  @Get('/getAllPosts')
  async getAllPosts(): Promise<Posts[]>{
    console.log('...get all posts')
    return await this.postService.getAllPosts()
  }
}
