import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserCommentService } from '../service/user-comment.service';
import { CommentDto } from '../dto/comment.dto';
import { Comments } from '../entities/Comments.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('comment')
@ApiTags('Comment')
export class UserCommentController {
  constructor(private readonly commentsService: UserCommentService) {}
  @Get('getAll/:postId')
  getAll(@Param('postId') postId: number): Promise<Comments[]> {
    return this.commentsService.getAllComments(postId);
  }
  @Post('/addComment')
  addComment(
    @Body() comment: CommentDto,
    @Req() req: Request,
  ): Promise<Comments[]> {
    return this.commentsService.createNewComment(comment, req['user'].user_id);
  }
}
