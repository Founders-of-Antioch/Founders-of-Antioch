import { TilePointProperties } from "../../../../types/entities/TilePoints";

export default class TilePoint implements TilePointProperties {
  positionOnTile: number;
  boardXPos: number;
  boardYPos: number;

  constructor(boardXPos: number, boardYPos: number, pos: number) {
    this.boardXPos = boardXPos;
    this.boardYPos = boardYPos;
    this.positionOnTile = pos;
  }

  equals(t: TilePoint) {
    return (
      this.boardXPos === t.boardXPos &&
      this.boardYPos === t.boardYPos &&
      this.positionOnTile === t.positionOnTile
    );
  }
}
