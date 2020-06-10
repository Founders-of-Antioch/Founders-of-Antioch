import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
} from "typeorm";
import { Board } from "./Board";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  // @OneToOne((type) => Board, (board) => board.game)
  // board: Board;
  @Column()
  boardID!: number;

  @Column()
  numberOfPlayers!: number;

  @Column()
  currentPlayersTurn!: number;

  @Column("text", { array: true })
  listOfPlayerIDs!: string[];
}
