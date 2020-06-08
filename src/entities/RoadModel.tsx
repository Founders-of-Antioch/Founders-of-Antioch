import { PlayerNumber } from "../Actions";

export class RoadModel {
  boardXPos: number;
  boardYPos: number;
  playerNum: PlayerNumber;
  hexEdgeNumber: number;

  constructor(
    boardXPos: number,
    boardYPos: number,
    playerNum: PlayerNumber,
    hexEdgeNumber: number
  ) {
    this.boardXPos = boardXPos;
    this.boardYPos = boardYPos;
    this.playerNum = playerNum;
    this.hexEdgeNumber = hexEdgeNumber;
  }
}
