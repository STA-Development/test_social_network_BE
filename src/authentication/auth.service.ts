import { Injectable, Post } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }
  getUserInfo(request: Request): Request {
    const ifUserExist:Promise<void> = this.userRepository.findBy({
      userIdToken: request['user'].user_id
    }).then((result:User[]) => {
      // console.log(result, 'this is the result of user search')
      if(!result.length){
        // console.log(request['user'],'as')
        const newUser:User = this.userRepository.create({
          userIdToken: request['user'].user_id,
          userName: request['user'].name,
          picture: request['user'].picture
        })
        const response: Promise<User> = this.userRepository.save(newUser);
      }
    })
    // console.log(ifUserExist, "User")

    return request['user'] ? request['user'] : '';
  }
}
