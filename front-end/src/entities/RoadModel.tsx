import { PlayerNumber } from "../../../types/Primitives";
import { RoadModelProperties } from "../../../types/entities/RoadModel";
import RoadPoint from "./Points/RoadPoint";

export class RoadModel implements RoadModelProperties {
  point: RoadPoint;
  playerNum: PlayerNumber;

  constructor(
    boardXPos: number,
    boardYPos: number,
    playerNum: PlayerNumber,
    hexEdgeNumber: number
  ) {
    this.point = new RoadPoint(boardXPos, boardYPos, hexEdgeNumber);
    this.playerNum = playerNum;
  }
}
