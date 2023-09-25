import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostDto } from '../dto/post.dto/post.dto';
import { PostService } from '../service/post/post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Post('createPost')
  async create(@Body() post: PostDto): Promise<PostDto> {
    console.log(post);
    return await this.postService.createPost(post);
  }
  @Get('getPosts')
  getPosts(@Body() userId: string) {
    console.log(userId);
  }
}
