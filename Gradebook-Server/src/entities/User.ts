import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import {Post} from './Post'
import { Upvote } from "./Upvote";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Column(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  // @OneToMany(() => Upvote, (upvote) => upvote.user)
  // upvotes: Upvote[];

}
