import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from '../user-comment/entities/Comments.entity';

@Injectable()
export class CommentsRepository extends BaseAbstractRepository<Comments> {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
  ) {
    super(commentsRepository);
  }
  getComments(postId: number): Promise<Comments[]> {
    return this.findWithRelations({
      where: {
        postId: postId,
      },
      relations: {
        user: true,
      },
    });
  }
  getCreatedComment(commentId: number) {
    return this.findByCondition({
      id: commentId,
    });
  }
}
