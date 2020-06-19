import { PlayerNumber } from "../redux/Actions";
import { TileModel } from "./TIleModel";

// Stolen from the API repo
export class Building {
  boardXPos: number;
  boardYPos: number;
  corner: number;
  playerNum: PlayerNumber;
  touchingTiles: Array<TileModel>;

  // Returns an array of TileModel representing the resources the building touches
  tilesBuildingIsOn(listOfTiles: Array<TileModel>) {
    let adjTiles: Array<TileModel> = [];
    // https://www.redblobgames.com/grids/hexagons/#neighbors
    let directions = [
      [1, 1],
      [1, 0],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [0, 1],
    ];

    // This filters out checking for any tiles that are not touching the building
    directions = directions.filter((el, idx) => {
      const checkOne = this.corner;
      let checkTwo = checkOne - 1;
      if (checkTwo === -1) {
        checkTwo = 5;
      }

      return idx === checkOne || idx === checkTwo;
    });
    // Count the tile it is on as well
    directions.push([0, 0]);

    for (const currDirection of directions) {
      const expecX = currDirection[0] + this.boardXPos;
      const expecY = currDirection[1] + this.boardYPos;

      for (const currTile of listOfTiles) {
        if (currTile.boardXPos === expecX && currTile.boardYPos === expecY) {
          adjTiles.push(currTile);
        }
      }
    }

    return adjTiles;
  }

  constructor(
    bX: number,
    bY: number,
    corn: number,
    playerNum: PlayerNumber,
    boardTiles: Array<TileModel>
  ) {
    this.boardXPos = bX;
    this.boardYPos = bY;
    this.corner = corn;
    this.playerNum = playerNum;
    this.touchingTiles = this.tilesBuildingIsOn(boardTiles);
  }
}
