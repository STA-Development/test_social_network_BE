import { Injectable } from '@nestjs/common';
import { Posts } from '../entities/Post.entity';
import { EditPostDto, PostDto } from '../dto/post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../authentication/entities/user.entity';
import { FirebaseApp } from '../../Firebase/firebase.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly firebaseService: FirebaseApp,
  ) {}
  async createPost(
    post: PostDto,
    photo: Express.Multer.File,
  ): Promise<Posts[]> {
    const { id } = await this.getUserByIdToken(post.userId);
    const newPost: Posts = this.postsRepository.create({
      title: post.title,
      description: post.description,
      photo: photo ? await this.firebaseService.uploadFile(photo) : null,
      userId: id,
    });
    await this.postsRepository.save(newPost);
    const createdPost: Posts[] = await this.postsRepository.find({
      where: {
        id: newPost.id,
      },
      relations: {
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return createdPost;
  }
  async getPosts(uId: string): Promise<Posts[]> {
    const { id } = await this.getUserByIdToken(uId);
    const userPosts: Posts[] = await this.postsRepository.find({
      where: {
        userId: id,
      },
      relations: {
        user: true,
      },
      take: 5,
    });
    return userPosts;
  }
  async getAllPosts(): Promise<Posts[]> {
    const allPosts: Posts[] = await this.postsRepository.find({
      relations: {
        user: true,
      },
      take: 5,
    });
    return allPosts;
  }
  async getMorePosts(length: number): Promise<Posts[]> {
    const morePosts: Posts[] = await this.postsRepository.find({
      relations: {
        user: true,
      },
      skip: length,
      take: 5,
    });
    return morePosts;
  }
  async getAllPostsLength(): Promise<number> {
    const allPostsCount: number = await this.postsRepository.count();
    return allPostsCount;
  }
  async getAllUserPostsLength(uId: string) {
    const { id } = await this.getUserByIdToken(uId);
    const allUserPostsCount: number = await this.postsRepository.count({
      where: {
        userId: id,
      },
    });
    return allUserPostsCount;
  }
  async getMoreUserPosts(length: number, uId: string): Promise<Posts[]> {
    try {
      const { id } = await this.getUserByIdToken(uId);

      const moreUserPosts: Posts[] = await this.postsRepository.find({
        where: {
          userId: id,
        },
        relations: {
          user: true,
        },
        skip: length,
        take: 5,
      });
      return moreUserPosts;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async editPost(
    editFormData: EditPostDto,
    photo: Express.Multer.File,
    postId: number,
    uId: string,
  ): Promise<[Posts[], string]> {
    try {
      const { id }: User = await this.getUserByIdToken(uId);
      const getCurrentPost: Posts = await this.postsRepository.findOneBy({
        id: postId,
        userId: id,
      });
      const oldPostPhoto: string = getCurrentPost.photo;
      getCurrentPost.title = editFormData.title;
      getCurrentPost.description = editFormData.description;
      if (editFormData.delete === 'true') {
        getCurrentPost.photo = '';
      }
      if (photo) {
        getCurrentPost.photo = await this.firebaseService.uploadFile(photo);
      }
      await this.postsRepository.save(getCurrentPost);
      const updated: Posts[] = await this.postsRepository.find({
        where: {
          userId: id,
        },
        relations: { user: true },
        order: {
          updatedAt: 'DESC',
        },
      });
      return [updated, oldPostPhoto];
    } catch (error) {
      throw new NotFoundError('User not found please sign in to your account');
    }
  }
  async deletePost(postId: number, uId: string): Promise<Posts[]> {
    try {
      const { id } = await this.getUserByIdToken(uId);
      await this.postsRepository.delete({
        id: postId,
        userId: id,
      });
      const getPosts: Posts[] = await this.postsRepository.find({
        where: {
          userId: id,
        },
        relations: {
          user: true,
        },
      });
      return getPosts;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  private async getUserByIdToken(uId: string): Promise<User> {
    try {
      const user: User = await this.userRepository.findOneBy({
        userIdToken: uId,
      });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
