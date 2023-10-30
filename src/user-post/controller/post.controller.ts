import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostDto } from '../dto/post.dto';
import { PostService } from '../service/post.service';
import { Posts } from '../entities/Post.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../decorators/user.decorator';
import { AuthGuard } from '../../user/guard/auth.guard';
import { UploadFileValidationInterceptor } from '../../intercepters/UploadFileValidation.interceptor';
import { EditPostDto } from '../dto/postEdit.dto';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private postService: PostService) {}
  @UseGuards(AuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('photo'), UploadFileValidationInterceptor)
  create(
    @Body() postFormData: PostDto,
    @UploadedFile()
    photo: Express.Multer.File,
  ): Promise<Posts[]> {
    return this.postService.createPost(postFormData, photo);
  }
  @UseGuards(AuthGuard)
  @Get('userPosts/:userId')
  getPosts(@Param('userId') userId: string): Promise<Posts[]> {
    return this.postService.getUserFirstFivePosts(userId);
  }
  @UseGuards(AuthGuard)
  @Get('/nextUserPosts/:length')
  getMoreUserPosts(
    @Param('length') length: number,
    @User('uId') uId: string,
  ): Promise<Posts[]> {
    return this.postService.getNextFiveUserPosts(length, uId);
  }
  @Get('/newsPagePosts')
  getAllPosts(): Promise<Posts[]> {
    return this.postService.getPostsForNewsPage();
  }
  @Get('/newsPagePosts/:length')
  getMorePosts(@Param('length') length: number): Promise<Posts[]> {
    return this.postService.getNextPostsForNewsPage(length);
  }
  @Get('/length')
  getAllPostsLength(): Promise<number> {
    return this.postService.getAllPostsLength();
  }
  @UseGuards(AuthGuard)
  @Get('/userPostsLength')
  getAllUserPostsLength(@User('uId') uId: string): Promise<number> {
    return this.postService.getAllUserPostsLength(uId);
  }
  @UseGuards(AuthGuard)
  @Patch('edit/:postId')
  @UseInterceptors(FileInterceptor('photo'), UploadFileValidationInterceptor)
  editPost(
    @Param('postId') postId: number,
    @User('uId') uId: string,
    @Body() editFormData: EditPostDto,
    @UploadedFile()
    photo: Express.Multer.File,
  ): Promise<Posts[]> {
    return this.postService.editPost(editFormData, photo, postId, uId);
  }
  @UseGuards(AuthGuard)
  @Delete('delete/:postId')
  deletePost(
    @Param('postId') postId: number,
    @User('uId') uId: string,
  ): Promise<Posts[]> {
    return this.postService.deletePost(postId, uId);
  }
}
