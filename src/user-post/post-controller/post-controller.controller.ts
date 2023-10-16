import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EditPostDto, PostDto } from '../dto/post.dto/post.dto';
import { PostService } from '../service/post/post.service';
import { Posts } from '../entities/Post.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private postService: PostService) {}
  @Post('createPost')
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @Body() postFormData: PostDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5999999 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    return this.postService.createPost(postFormData, photo);
  }
  @Get('/userPosts/:userId')
  getPosts(@Param('userId') userId: string): Promise<Posts[]> {
    return this.postService.getPosts(userId);
  }
  @Get('/getAllPosts')
  getAllPosts(): Promise<Posts[]> {
    console.log('...get all posts');
    return this.postService.getAllPosts();
  }
  @Get('/getAllPosts/:length')
  getMorePosts(@Param('length') length: number): Promise<Posts[]> {
    return this.postService.getMorePosts(length);
  }
  @Get('/getUserAllPosts/:length')
  getMoreUserPosts(
    @Param('length') length: number,
    @Req() req: Request,
  ): Promise<Posts[]> {
    return this.postService.getMoreUserPosts(length, req['user'].user_id);
  }
  @Get('/getAllPostsLength')
  getAllPostsLength(): Promise<number> {
    return this.postService.getAllPostsLength();
  }
  @Get('/getAllUserPostsLength')
  getAllUserPostsLength(@Req() req: Request): Promise<number> {
    return this.postService.getAllUserPostsLength(req['user'].user_id);
  }
  @Patch('edit/:postId')
  @UseInterceptors(FileInterceptor('photo'))
  editPost(
    @Param('postId') postId: number,
    @Req() req: Request,
    @Body() editFormData: EditPostDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5999999 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ): Promise<[Posts[], string]> {
    return this.postService.editPost(
      editFormData,
      photo,
      postId,
      req['user'].user_id,
    );
  }
  @Delete('delete/:postId')
  deletePost(
    @Param('postId') postId: number,
    @Req() req: Request,
  ): Promise<Posts[]> {
    return this.postService.deletePost(postId, req['user'].user_id);
  }
}
