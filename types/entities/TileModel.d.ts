import { ResourceString } from "../Primitives";

export interface TileProperties {
  resource: ResourceString;
  counter: number;
  boardXPos: number;
  boardYPos: number;
}
