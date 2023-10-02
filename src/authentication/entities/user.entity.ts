import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Posts} from '../../user-post/entities/Post.entity';

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
  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];
}
