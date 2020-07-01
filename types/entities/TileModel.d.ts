import { ResourceString } from "../Primitives";
import BoardPoint from "../../front-end/src/entities/Points/BoardPoint";

export interface TileProperties {
  resource: ResourceString;
  counter: number;
  point: BoardPoint;
}
