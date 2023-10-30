import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserCommentService } from '../service/user-comment.service';
import { CommentDto } from '../dto/comment.dto';
import { Comments } from '../entities/Comments.entity';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../decorators/user.decorator';
import { AuthGuard } from '../../user/guard/auth.guard';

@Controller('comment')
@ApiTags('Comment')
export class UserCommentController {
  constructor(private readonly commentsService: UserCommentService) {}
  @Get('/:postId')
  getAll(@Param('postId') postId: number): Promise<Comments[]> {
    return this.commentsService.getPostAllComments(postId);
  }
  @Post('/Add')
  @UseGuards(AuthGuard)
  addComment(
    @Body() comment: CommentDto,
    @User('uId') uId: string,
  ): Promise<Comments> {
    return this.commentsService.createNewComment(comment, uId);
  }
}
