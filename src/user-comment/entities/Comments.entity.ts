import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../authentication/entities/user.entity';
import { Posts } from '../../user-post/entities/Post.entity';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  comment: string;

  @Column()
  postId: number;
  @ManyToOne(() => Posts, (posts: Posts) => posts.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Posts;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user: User) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
