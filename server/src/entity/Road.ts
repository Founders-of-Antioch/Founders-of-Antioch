export class Road {
  boardXPos: number;
  boardYPos: number;
  playerNum: number;
  // Like corners, number 0-5 where the first edge to the right of the tip of the tile is '0' and goes clockwise
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
