import {
  Entity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { Game } from "./Game";

// Stolen from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a: Array<any>) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randResources() {
  let resourcesSequence = ["desert"];
  for (let i = 0; i < 4; i++) {
    resourcesSequence = resourcesSequence
      .concat("wood")
      .concat("sheep")
      .concat("wheat");
  }
  for (let i = 0; i < 3; i++) {
    resourcesSequence = resourcesSequence.concat("brick").concat("ore");
  }

  return shuffle(resourcesSequence);
}

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text", { array: true })
  resources!: string[];

  // @OneToOne((type) => Game, (game) => game.board)
  // game: Game;
  @Column()
  gameID!: number;

  @Column("text", { array: true })
  counters!: string[];
}
