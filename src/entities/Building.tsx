import { PlayerNumbers } from "../Actions";

// Stolen from the API repo
export class Building {
  boardXPos: number;
  boardYPos: number;
  corner: number;
  playerNum: PlayerNumbers;

  constructor(bX: number, bY: number, corn: number, playerNum: PlayerNumbers) {
    this.boardXPos = bX;
    this.boardYPos = bY;
    this.corner = corn;
    this.playerNum = playerNum;
  }
}
