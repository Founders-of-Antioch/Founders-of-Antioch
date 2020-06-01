export class RoadModel {
  boardXPos: number;
  boardYPos: number;
  playerNum: number;
  hexEdgeNumber: number;

  constructor(
    boardXPos: number,
    boardYPos: number,
    playerNum: number,
    hexEdgeNumber: number
  ) {
    this.boardXPos = boardXPos;
    this.boardYPos = boardYPos;
    this.playerNum = playerNum;
    this.hexEdgeNumber = hexEdgeNumber;
  }
}
