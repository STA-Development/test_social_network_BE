import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto/user.dto';
import { FirebaseApp } from '../../Firebase/firebase.service';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private userRepository: UserRepository,
    private readonly firebaseService: FirebaseApp,
  ) {}
  async getUserInfo(user: UserDto): Promise<UserDto> {
    const userExist: boolean = await this.userRepository.checkUserExist(
      user.uId,
    );
    if (!userExist) {
      const newUser: User[] = this.userRepository.create({
        userIdToken: user.uId,
        userName: user.name,
        picture: user.picture,
      });
      await this.userRepository.save(newUser);
    }
    return user;
  }
  async changeUserAvatar(
    file: Express.Multer.File,
    uId: string,
    picture: string,
  ): Promise<string> {
    const oldUrl: string = picture;
    await this.firebaseService.deleteFile(oldUrl);
    const url: string = await this.firebaseService.uploadFile(file);
    await this.userRepository.updateUserCredential(uId, url);
    await this.firebaseService.userProfileUpdate(uId, url);
    return url;
  }
}
