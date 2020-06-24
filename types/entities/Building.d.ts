import { PlayerNumber } from "../Primitives";
import { TileProperties } from "./TileModel";

export interface BuildingProperties {
  boardXPos: number;
  boardYPos: number;
  corner: number;
  playerNum: PlayerNumber;
  touchingTiles: Array<TileProperties>;
}
