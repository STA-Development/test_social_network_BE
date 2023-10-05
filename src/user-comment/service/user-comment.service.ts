import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Comments} from "../entities/Comments.entity";
import {Repository} from "typeorm";
import {CommentDto} from "../dto/comment.dto";
import {User} from "../../authentication/entities/user.entity";

@Injectable()
export class UserCommentService {
    constructor(@InjectRepository(Comments) private readonly comments: Repository<Comments>,
                @InjectRepository(User) private readonly user: Repository<User>) {}
    async getAllComments(postId: number):Promise<Comments[]>{
        const getAllCommentsForPost = await this.comments.find({
            where:{
                postId:postId,
            },
            relations:{
                user:true
            }
        })
        return getAllCommentsForPost
    }
    async createNewComment(comment: CommentDto, uId: string):Promise<Comments[]>{
        console.log(uId)
        try {
            const getUserId:User[] = await this.user.find({
                where:{
                    userIdToken: uId
                },
                select: {
                    id:true
                }
            })
            const newComment: Comments = this.comments.create({
                comment: comment.comment,
                userId: getUserId[0].id,
                postId: comment.postId
            })
            await this.comments.save(newComment)
            const getNewPost:Comments[] = await this.comments.find({
                where: {
                    id: newComment.id
                },
                relations:{
                    user:true
                }
            })
            return getNewPost
        }catch (e) {
            throw new Error(e.message)
        }
    }
}
