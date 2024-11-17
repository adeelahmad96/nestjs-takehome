import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index("idx_user_age", ["age"])
@Index("idx_user_name", ["name"])
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  age: number;
}
