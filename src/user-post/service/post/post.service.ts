import { Injectable } from '@nestjs/common';
import { Post } from '../../entities/Post.entity';
import { PostDto } from '../../dto/post.dto/post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {User} from "../../../authentication/entities/user.entity";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createPost(post: PostDto): Promise<PostDto> {
    const userId = await this.userRepository.findOne({
      where:{
        userIdToken: post.userId
      }
    });
    console.log(userId.id)
    const newPost: any = this.postsRepository.create({
      title: post.title,
      description: post.description,
      photo: post.photo,
      userId: userId.id,
    });
    return await this.postsRepository.save(newPost);
  }
  async getPosts(userId: string){
    const getUserId: User = await this.userRepository.findOne({
      where: {
        userIdToken: userId
      }
    })
    console.log(getUserId)
    if(!getUserId){
       throw new Error('Something goes wrong')
    }
    const getUserPosts: Post[] = await this.postsRepository.findBy({
      userId: getUserId.id
    })
    console.log(getUserPosts)
    return getUserPosts;
    // console.log(getUserId, );
  };
}
