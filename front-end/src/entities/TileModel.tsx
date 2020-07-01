import { TileProperties } from "../../../types/entities/TileModel";
import { ResourceString } from "../../../types/Primitives";
import BoardPoint from "./Points/BoardPoint";

export class TileModel implements TileProperties {
  resource: ResourceString;
  counter: number;
  point: BoardPoint;

  constructor(
    resource: ResourceString,
    counter: number,
    boardXPos: number,
    boardYPos: number
  ) {
    this.resource = resource;
    this.counter = counter;
    this.point = new BoardPoint(boardXPos, boardYPos);
  }
}
