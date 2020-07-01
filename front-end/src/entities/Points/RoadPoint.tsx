import TilePoint from "./TilePoint";
import { NEIGHBOR_DIRECTIONS } from "../TilePointHelper";

const roadEdgeMap = [3, 4, 5, 0, 1, 2];

export default class RoadPoint extends TilePoint {
  equals(r: RoadPoint) {
    if (
      this.boardPoint.equals(r.boardPoint) &&
      this.positionOnTile === r.positionOnTile
    ) {
      return true;
    }

    for (let i = 0; i < NEIGHBOR_DIRECTIONS.length; i++) {
      const currDirection = NEIGHBOR_DIRECTIONS[i];
      const deltaX = currDirection[0];
      const deltaY = currDirection[1];
      if (
        r.boardPoint.boardXPos === this.boardPoint.boardXPos + deltaX &&
        r.boardPoint.boardYPos === this.boardPoint.boardYPos + deltaY
      ) {
        return roadEdgeMap[i] === r.positionOnTile && i === this.positionOnTile;
      }
    }

    return false;
  }
}
