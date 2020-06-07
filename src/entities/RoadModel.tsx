import { PlayerNumbers } from "../Actions";

export class RoadModel {
  boardXPos: number;
  boardYPos: number;
  playerNum: PlayerNumbers;
  hexEdgeNumber: number;

  constructor(
    boardXPos: number,
    boardYPos: number,
    playerNum: PlayerNumbers,
    hexEdgeNumber: number
  ) {
    this.boardXPos = boardXPos;
    this.boardYPos = boardYPos;
    this.playerNum = playerNum;
    this.hexEdgeNumber = hexEdgeNumber;
  }
}
