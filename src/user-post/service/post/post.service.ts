import {Injectable} from '@nestjs/common';
import {Posts} from '../../entities/Post.entity';
import {PostDto} from '../../dto/post.dto/post.dto';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from "../../../authentication/entities/user.entity";
import {FirebaseApp} from "../../../Firebase/firebase.service";
import {firestore} from "firebase-admin";
import {getAuth} from "firebase-admin/lib/auth";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly firebaseService: FirebaseApp
  ) {}
  async createPost(post: PostDto, photo: Express.Multer.File): Promise<Posts[]> {
    // if(!post || !post.title.length || !post.description.length || fileUpload != ""){
    //   throw new HttpException({
    //     status: HttpStatus.NOT_ACCEPTABLE,
    //     error: 'this is not Acceptable!!!'
    //   },HttpStatus.NOT_ACCEPTABLE)
    // }

    const userId = await this.userRepository.findOne({
      where:{
        userIdToken: post.userId
      }
    });
    const newPost: any = this.postsRepository.create({
      title: post.title,
      description: post.description,
      photo: await this.firebaseService.uploadFile(photo),
      userId: userId.id,
    });
    await this.postsRepository.save(newPost)
    const createdPost:Posts[] = await this.postsRepository.find({
      where:{
        id:newPost.id
      },
      relations: {
        user: true
      }
    })
    return createdPost;
  }
  async getPosts(userId: string){
    const getUser: User = await this.userRepository.findOne({
      where: {
        userIdToken: userId
      }
    })
    if(!getUser){
       throw new Error('Something goes wrong')
    }
    const userPosts:Posts[] = await this.postsRepository.find({
      where: {
        userId: getUser.id
      },
      relations: {
        user: true
      },
      take: 5
    })
    return userPosts
  };
  async getAllPosts(): Promise<Posts[]>{
    const allPosts = await this.postsRepository.find({
      relations:{
        user: true
      },
      take: 10,
    })
    return allPosts
  }
  async getMorePosts(length:number):Promise<Posts[]> {
    const morePosts:Posts[] = await this.postsRepository.find({
      relations:{
        user: true
      },
      skip: length,
      take: 10,
    })
    return morePosts
  }
  async getMoreUserPosts(length: number, uId:string): Promise<Posts[]> {
    console.log(length)
    const currentUser: User =  await this.userRepository.findOne({
      where: {
        userIdToken: uId
      }
    })
    if(!currentUser){
      throw new Error('Something goes wrong')
    }
    const moreUserPosts: Posts[] = await this.postsRepository.find({
      where: {
        userId: currentUser.id
      },
      relations:{
        user: true
      },
      skip:length,
      take: 5
    })
    return moreUserPosts
  }
}
