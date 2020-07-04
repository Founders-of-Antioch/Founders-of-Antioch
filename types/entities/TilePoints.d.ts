import { BoardPointProperties } from "./BoardPoint";

export interface TilePointProperties extends BoardPointProperties {
  positionOnTile: number;
}
