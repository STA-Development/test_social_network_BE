import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from '../entities/Comments.entity';
import { Repository } from 'typeorm';
import { CommentDto } from '../dto/comment.dto';
import { User } from '../../authentication/entities/user.entity';

@Injectable()
export class UserCommentService {
  constructor(
    @InjectRepository(Comments) private readonly comments: Repository<Comments>,
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}
  async getAllComments(postId: number): Promise<Comments[]> {
    const getAllCommentsForPost: Comments[] = await this.comments.find({
      where: {
        postId: postId,
      },
      relations: {
        user: true,
      },
    });
    return getAllCommentsForPost;
  }
  async createNewComment(
    comment: CommentDto,
    uId: string,
  ): Promise<Comments[]> {
    try {
      const newComment: Comments = this.comments.create({
        comment: comment.comment,
        userId: await this.getUserIdByToken(uId),
        postId: comment.postId,
      });
      await this.comments.save(newComment);
      const commentsById: Comments[] = await this.getCommentsById(
        newComment.id,
      );
      return commentsById;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  private async getCommentsById(newCommentId: number): Promise<Comments[]> {
    try {
      const comments: Comments[] = await this.comments.find({
        where: {
          id: newCommentId,
        },
        relations: {
          user: true,
        },
      });
      return comments;
    } catch (error) {
      throw new Error(error.message());
    }
  }
  private async getUserIdByToken(uId: string) {
    try {
      const { id } = await this.user.findOne({
        where: {
          userIdToken: uId,
        },
        select: {
          id: true,
        },
      });
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
