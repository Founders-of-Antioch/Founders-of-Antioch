import { BoardPointProperties } from "../../../../types/entities/BoardPoint";

export default class BoardPoint implements BoardPointProperties {
  boardXPos: number;
  boardYPos: number;

  constructor(x: number, y: number) {
    this.boardXPos = x;
    this.boardYPos = y;
  }

  equals(b: BoardPoint) {
    return this.boardXPos === b.boardXPos && this.boardYPos === b.boardYPos;
  }
}
