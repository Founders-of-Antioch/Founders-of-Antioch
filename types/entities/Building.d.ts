import { PlayerNumber } from "../Primitives";
import { TileProperties } from "./TileModel";

export interface BuildingProperties {
  point: TilePoint;
  playerNum: PlayerNumber;
  touchingTiles: Array<TileProperties>;
  turnPlaced: number;
  typeOfBuilding: "settlement" | "city";
}
