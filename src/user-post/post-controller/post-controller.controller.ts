import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {getPost, PostDto} from '../dto/post.dto/post.dto';
import { PostService } from '../service/post/post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Post('createPost')
  async create(@Body() post: PostDto): Promise<PostDto> {
    console.log(post);
    return await this.postService.createPost(post);
  }
  @Get('/userPosts/:userId')
  getPosts(@Param('userId') userId: string) {
    console.log(userId, "...userId")
    return this.postService.getPosts(userId)
  }
}
