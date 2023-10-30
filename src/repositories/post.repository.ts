import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { Posts } from '../user-post/entities/Post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostRepository extends BaseAbstractRepository<Posts> {
  constructor(
    @InjectRepository(Posts) private readonly postRepository: Repository<Posts>,
  ) {
    super(postRepository);
  }
  getCreatedPost(postId: number): Promise<Posts[]> {
    return this.findWithRelations({
      where: {
        id: postId,
      },
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
  getUserPosts(id: number): Promise<Posts[]> {
    return this.findWithRelations({
      where: {
        userId: id,
      },
      relations: {
        user: true,
      },
      take: 5,
    });
  }
  getUserNextPosts(id: number, length: number): Promise<Posts[]> {
    return this.findWithRelations({
      where: {
        userId: id,
      },
      relations: {
        user: true,
      },
      skip: length,
      take: 5,
    });
  }
  getPostsForNewsPage(): Promise<Posts[]> {
    return this.findWithRelations({
      relations: {
        user: true,
      },
      take: 5,
    });
  }
  getNextPostsForNewsPage(length: number) {
    return this.findWithRelations({
      relations: {
        user: true,
      },
      skip: length,
      take: 5,
    });
  }
  getUpdatedPosts(id: number): Promise<Posts[]> {
    return this.findWithRelations({
      where: {
        userId: id,
      },
      relations: { user: true },
      order: {
        updatedAt: 'DESC',
      },
    });
  }
  getPostsAfterDelete(id: number) {
    return this.findWithRelations({
      where: {
        userId: id,
      },
      relations: {
        user: true,
      },
    });
  }
}
