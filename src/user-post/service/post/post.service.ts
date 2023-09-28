import {Injectable} from '@nestjs/common';
import {Posts} from '../../entities/Post.entity';
import {PostDto, transferPostDto} from '../../dto/post.dto/post.dto';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from "../../../authentication/entities/user.entity";
import {FirebaseApp} from "../../../Firebase/firebase.service";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly firebaseService: FirebaseApp
  ) {}
  async createPost(post: PostDto, photo: Express.Multer.File): Promise<transferPostDto> {
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
    return this.postsRepository.save(newPost);
  }
  async getPosts(userId: string){
    const getUserId: User = await this.userRepository.findOne({
      where: {
        userIdToken: userId
      }
    })
    if(!getUserId){
       throw new Error('Something goes wrong')
    }
    return await this.postsRepository.findBy({
      userId: getUserId.id
    })
  };
  async getAllPosts(): Promise<Posts[]>{
    return await this.postsRepository.find()
  }
}
