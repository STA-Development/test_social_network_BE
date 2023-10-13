import { Injectable } from '@nestjs/common';
import { Posts } from '../../entities/Post.entity';
import { EditPostDto, PostDto } from '../../dto/post.dto/post.dto';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../authentication/entities/user.entity';
import { FirebaseApp } from '../../../Firebase/firebase.service';
import { NotFoundError } from 'rxjs';
// import {UserRecord} from "firebase-admin/lib/auth";

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
    const userId = await this.userRepository.findOne({
      where: {
        userIdToken: post.userId,
      },
    });
    const newPost: Posts = this.postsRepository.create({
      title: post.title,
      description: post.description,
      photo: photo ? await this.firebaseService.uploadFile(photo) : null,
      userId: userId.id,
    });
    await this.postsRepository.save(newPost);
    const createdPost: Posts[] = await this.postsRepository.find({
      where: {
        id: newPost.id,
      },
      relations: {
        user: true,
      },
    });
    return createdPost;
  }
  async getPosts(userId: string) {
    const getUser: User = await this.userRepository
      .findOne({
        where: {
          userIdToken: userId,
        },
      })
      .catch((error) => {
        throw new Error('Something goes wrong');
      });

    const userPosts: Posts[] = await this.postsRepository.find({
      where: {
        userId: getUser.id,
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
    const allPosts: Posts[] = await this.postsRepository.find();
    return allPosts.length;
  }
  async getAllUserPostsLength(userId: string) {
    const getUser: User = await this.userRepository.findOneBy({
      userIdToken: userId,
    });
    const allPosts: Posts[] = await this.postsRepository.find({
      where: {
        userId: getUser.id,
      },
    });
    return allPosts.length;
  }
  async getMoreUserPosts(length: number, uId: string): Promise<Posts[]> {
    console.log(length);
    try {
      const currentUser: User = await this.userRepository.findOne({
        where: {
          userIdToken: uId,
        },
      });

      const moreUserPosts: Posts[] = await this.postsRepository.find({
        where: {
          userId: currentUser.id,
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
      const getUserID: User = await this.userRepository.findOneBy({
        userIdToken: uId,
      });
      const getCurrentPost: Posts = await this.postsRepository.findOneBy({
        id: postId,
        userId: getUserID.id,
      });
      console.log(photo, 'photo');
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
          userId: getUserID.id,
        },
        relations: { user: true },
      });
      return [updated.reverse(), oldPostPhoto];
    } catch (error) {
      throw new NotFoundError('User not found please sign in to your account');
    }
  }
  async deletePost(postId: number, uId: string): Promise<Posts[]> {
    console.log(uId);
    try {
      const getUserID: User = await this.userRepository.findOneBy({
        userIdToken: uId,
      });
      await this.postsRepository.delete({
        id: postId,
        userId: getUserID.id,
      });
      const getPosts: Posts[] = await this.postsRepository.find({
        where: {
          userId: getUserID.id,
        },
        relations: {
          user: true,
        },
      });
      return getPosts.reverse();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
