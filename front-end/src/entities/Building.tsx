import { TileModel } from "./TileModel";
import { PlayerNumber } from "../../../types/Primitives";
import { BuildingProperties } from "../../../types/entities/Building";
import { tilesPointIsOn } from "./TilePointHelper";
import TilePoint from "./Points/TilePoint";
import BoardPoint from "./Points/BoardPoint";
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
    boardPoint: BoardPoint,
    corn: number,
    playerNum: PlayerNumber,
    turnPlaced: number,
    typeOfBuilding: "settlement" | "city",
    tiles: Array<TileModel>
  ) {
    this.point = new BuildingPoint(boardPoint, corn);
    this.playerNum = playerNum;
    this.touchingTiles = this.tilesBuildingIsOn(tiles);
    this.turnPlaced = turnPlaced;
    this.typeOfBuilding = typeOfBuilding;
  }

  spacesAreSame(b: Building) {
    return (
      this.point.boardPoint.equals(b.point.boardPoint) &&
      this.point.positionOnTile === b.point.positionOnTile
    );
  }
}
