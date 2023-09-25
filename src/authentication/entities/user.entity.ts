import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../user-post/entities/Post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userIdToken: string;
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
