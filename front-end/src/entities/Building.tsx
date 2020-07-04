import { TileModel } from "./TileModel";
import { PlayerNumber } from "../../../types/Primitives";
import { BuildingProperties } from "../../../types/entities/Building";
import { tilesPointIsOn } from "./TilePointHelper";
import TilePoint from "./Points/TilePoint";
import BuildingPoint from "./Points/BuildingPoint";

export class Building implements BuildingProperties {
  point: TilePoint;
  playerNum: PlayerNumber;
  touchingTiles: Array<TileModel>;
  turnPlaced: number;
  typeOfBuilding: "settlement" | "city";

  // Returns an array of TileModel representing the resources the building touches
  private tilesBuildingIsOn(tiles: Array<TileModel>) {
    return tilesPointIsOn(tiles, this.point);
  }

  constructor(
    boardXPos: number,
    boardYPos: number,
    corn: number,
    playerNum: PlayerNumber,
    turnPlaced: number,
    typeOfBuilding: "settlement" | "city",
    tiles: Array<TileModel>
  ) {
    this.point = new BuildingPoint(boardXPos, boardYPos, corn);
    this.playerNum = playerNum;
    this.touchingTiles = this.tilesBuildingIsOn(tiles);
    this.turnPlaced = turnPlaced;
    this.typeOfBuilding = typeOfBuilding;
  }

  spacesAreSame(b: Building) {
    return this.point.equals(b.point);
  }
}
