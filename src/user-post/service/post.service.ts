import { Inject, Injectable } from '@nestjs/common';
import { Posts } from '../entities/Post.entity';
import { PostDto } from '../dto/post.dto';
import { User } from '../../user/entities/user.entity';
import { FirebaseApp } from '../../Firebase/firebase.service';
import { PostRepository } from '../../repositories/post.repository';
import { UserRepository } from '../../repositories/user.repository';
import { EditPostDto } from '../dto/postEdit.dto';
import { PostParseDto } from '../dto/PostParse.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject('PostRepositoryInterface')
    private readonly postRepository: PostRepository,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepository,
    private readonly firebaseService: FirebaseApp,
  ) {}
  async createPost(
    post: PostDto,
    photo: Express.Multer.File,
  ): Promise<Posts[]> {
    const { id } = await this.getUserByIdToken(post.userId);
    const newPost: Posts = await this.postRepository.save({
      title: post.title,
      description: post.description,
      photo: photo ? await this.firebaseService.uploadFile(photo) : null,
      userId: id,
    });
    const createdPost: Posts[] = await this.postRepository.getCreatedPost(
      newPost.id,
    );
    return createdPost;
  }
  async getUserFirstFivePosts(uId: string): Promise<Posts[]> {
    const { id } = await this.getUserByIdToken(uId);
    const posts: Posts[] = await this.postRepository.getUserPosts(id);
    return posts;
  }
  async getNextFiveUserPosts(length: number, uId: string): Promise<Posts[]> {
    try {
      const { id } = await this.getUserByIdToken(uId);
      const moreUserPosts: Posts[] = await this.postRepository.getUserNextPosts(
        id,
        length,
      );
      return moreUserPosts;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async getPostsForNewsPage(): Promise<Posts[]> {
    const posts: Posts[] = await this.postRepository.getPostsForNewsPage();
    return posts;
  }
  async getNextPostsForNewsPage(length: number): Promise<Posts[]> {
    const posts: Posts[] =
      await this.postRepository.getNextPostsForNewsPage(length);
    return posts;
  }
  async getAllPostsLength(): Promise<number> {
    const length: number = await this.postRepository.countAll();
    return length;
  }
  async getAllUserPostsLength(uId: string) {
    const { id } = await this.getUserByIdToken(uId);
    const length: number = await this.postRepository.count({
      userId: id,
    });
    return length;
  }

  async editPost(
    editFormData: EditPostDto,
    photo: Express.Multer.File,
    postId: number,
    uId: string,
  ): Promise<Posts[]> {
    const data: PostParseDto = JSON.parse(editFormData.data);
    const { id }: User = await this.getUserByIdToken(uId);
    await this.editAndSavePost(postId, id, data, photo);
    const updated: Posts[] = await this.postRepository.getUpdatedPosts(id);
    return updated;
  }
  async deletePost(postId: number, uId: string): Promise<Posts[]> {
    try {
      const { id } = await this.getUserByIdToken(uId);
      const { photo } = await this.postRepository.findByCondition({
        id: postId,
        userId: id,
      });
      if (photo) {
        await this.firebaseService.deleteFile(photo);
      }
      await this.postRepository.removeByCondition({
        id: postId,
        userId: id,
      });
      const getPosts: Posts[] =
        await this.postRepository.getPostsAfterDelete(id);
      return getPosts;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  private async getUserByIdToken(uId: string): Promise<User> {
    try {
      const user: User = await this.userRepository.findByCondition({
        userIdToken: uId,
      });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  private async editAndSavePost(
    postId: number,
    id: number,
    data: PostParseDto,
    photo: Express.Multer.File,
  ): Promise<void> {
    const currentPost: Posts = await this.postRepository.findByCondition({
      id: postId,
      userId: id,
    });
    currentPost.title = data.title;
    currentPost.description = data.description;
    const oldPostPhoto: string = currentPost.photo;
    if (data.delete && oldPostPhoto) {
      await this.firebaseService.deleteFile(oldPostPhoto);
      currentPost.photo = '';
    }
    if (data.delete) {
      currentPost.photo = '';
    }
    if (photo && oldPostPhoto) {
      await this.firebaseService.deleteFile(oldPostPhoto);
      currentPost.photo = await this.firebaseService.uploadFile(photo);
    }
    if (photo) {
      currentPost.photo = await this.firebaseService.uploadFile(photo);
    }
    await this.postRepository.save(currentPost);
  }
}
