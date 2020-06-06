// import { Building } from "./Building";

export class TileModel {
  resource: string;
  counter: number;
  boardXPos: number;
  boardYPos: number;
  // buildings: Array<Building>;

  constructor(
    resource: string,
    counter: number,
    boardXPos: number,
    boardYpos: number
  ) {
    this.resource = resource;
    this.counter = counter;
    this.boardXPos = boardXPos;
    this.boardYPos = boardYpos;
    // this.buildings = [];
  }

  // copyOverBuildings(t: TileModel) {
  //   const cpy = [...t.buildings];
  //   this.buildings = cpy;
  // }
}
