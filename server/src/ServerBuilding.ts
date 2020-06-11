export class ServerBuilding {
  boardXPos: number;
  boardYPos: number;
  corner: number;
  playerNum: number;

  constructor(bX: number, bY: number, corn: number, playerNum: number) {
    this.boardXPos = bX;
    this.boardYPos = bY;
    this.corner = corn;
    this.playerNum = playerNum;
  }
}
