import TilePoint from "./TilePoint";
import { NEIGHBOR_DIRECTIONS } from "../TilePointHelper";

const roadEdgeMap = [3, 4, 5, 0, 1, 2];

export default class RoadPoint extends TilePoint {
  equals(r: RoadPoint) {
    if (
      this.boardXPos === r.boardXPos &&
      this.boardYPos === r.boardYPos &&
      this.positionOnTile === r.positionOnTile
    ) {
      return true;
    }

    for (let i = 0; i < NEIGHBOR_DIRECTIONS.length; i++) {
      const currDirection = NEIGHBOR_DIRECTIONS[i];
      const deltaX = currDirection[0];
      const deltaY = currDirection[1];
      if (
        r.boardXPos === this.boardXPos + deltaX &&
        r.boardYPos === this.boardYPos + deltaY
      ) {
        return roadEdgeMap[i] === r.positionOnTile && i === this.positionOnTile;
      }
    }

    return false;
  }
}
