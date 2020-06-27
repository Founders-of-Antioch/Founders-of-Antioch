import { TileModel } from "./TileModel";
import { PlayerNumber } from "../../../types/Primitives";
import { BuildingProperties } from "../../../types/entities/Building";
import { tilesPointIsOn } from "./TilePointHelper";

export class Building implements BuildingProperties {
  boardXPos: number;
  boardYPos: number;
  corner: number;
  playerNum: PlayerNumber;
  touchingTiles: Array<TileModel>;
  turnPlaced: number;

  // Returns an array of TileModel representing the resources the building touches
  private tilesBuildingIsOn(listOfTiles: Array<TileModel>) {
    const { boardXPos, boardYPos, corner } = this;
    // return tilesPointIsOn(listOfTiles, { boardXPos, boardYPos, corner });
    return tilesPointIsOn({ boardXPos, boardYPos, corner });
  }

  constructor(
    bX: number,
    bY: number,
    corn: number,
    playerNum: PlayerNumber,
    boardTiles: Array<TileModel>,
    turnPlaced: number
  ) {
    this.boardXPos = bX;
    this.boardYPos = bY;
    this.corner = corn;
    this.playerNum = playerNum;
    this.touchingTiles = this.tilesBuildingIsOn(boardTiles);
    this.turnPlaced = turnPlaced;
  }
}
