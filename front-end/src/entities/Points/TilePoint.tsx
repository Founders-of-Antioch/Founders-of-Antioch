import { TilePointProperties } from "../../../../types/entities/TilePoints";
import BoardPoint from "./BoardPoint";

export default class TilePoint implements TilePointProperties {
  boardPoint: BoardPoint;
  positionOnTile: number;

  constructor(boardPoint: BoardPoint, pos: number) {
    this.boardPoint = boardPoint;
    this.positionOnTile = pos;
  }

  equals(t: TilePoint) {
    return (
      this.boardPoint.equals(t.boardPoint) &&
      this.positionOnTile === t.positionOnTile
    );
  }
}
