import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../authentication/entities/user.entity';
import { Comments } from '../../user-comment/entities/Comments.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ nullable: true })
  photo: string;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user: User) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Comments, (comments: Comments) => comments.postId)
  comments: Comments[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
