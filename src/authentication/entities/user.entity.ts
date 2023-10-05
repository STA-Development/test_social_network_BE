import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Posts} from '../../user-post/entities/Post.entity';
import {Comments} from "../../user-comment/entities/Comments.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userName: string;
  @Column()
  picture: string;
  @Column()
  userIdToken: string;
  @OneToMany(() => Posts, (post: Posts) => post.user)
  posts: Posts[];
  @OneToMany(() => Comments, (comments: Comments) => comments.userId)
  comments: Comments[]
}
