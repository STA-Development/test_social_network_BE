import { Injectable } from '@nestjs/common';
import { Post } from '../../entities/Post.entity';
import { PostDto } from '../../dto/post.dto/post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}
  async createPost(post: PostDto): Promise<PostDto> {
    const newPost = this.postsRepository.create({
      title: post.title,
      description: post.description,
      photo: post.photo,
    });

    return await this.postsRepository.save(newPost);
  }
}
