import { Inject, Injectable } from '@nestjs/common';
import { Comments } from '../entities/Comments.entity';
import { CommentDto } from '../dto/comment.dto';
import { CommentsRepository } from '../../repositories/comments.repository';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UserCommentService {
  constructor(
    @Inject('CommentsRepositoryInterface')
    private commentsRepository: CommentsRepository,
    @Inject('UserRepositoryInterface')
    private userRepository: UserRepository,
  ) {}
  async getPostAllComments(postId: number): Promise<Comments[]> {
    const comments: Comments[] =
      await this.commentsRepository.getComments(postId);
    return comments;
  }
  async createNewComment(comment: CommentDto, uId: string): Promise<Comments> {
    try {
      const { id } = await this.userRepository.findByCondition({
        userIdToken: uId,
      });
      const newComment: Comments = await this.commentsRepository.save({
        comment: comment.comment,
        userId: id,
        postId: comment.postId,
      });
      const commentsById: Comments =
        await this.commentsRepository.getCreatedComment(newComment.id);
      return commentsById;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
