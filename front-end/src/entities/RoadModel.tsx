import { PlayerNumber } from "../../../types/Primitives";
import { RoadModelProperties } from "../../../types/entities/RoadModel";
import RoadPoint from "./Points/RoadPoint";
import BoardPoint from "./Points/BoardPoint";

export class RoadModel implements RoadModelProperties {
  point: RoadPoint;
  playerNum: PlayerNumber;

  constructor(
    boardPoint: BoardPoint,
    playerNum: PlayerNumber,
    hexEdgeNumber: number
  ) {
    this.point = new RoadPoint(boardPoint, hexEdgeNumber);
    this.playerNum = playerNum;
  }
}
