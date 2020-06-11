import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

// A user is someone who signs up with the website, whereas a player is an entity who is currently playing a game (and can have a user)
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;
}
