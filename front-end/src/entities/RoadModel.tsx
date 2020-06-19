import { PlayerNumber } from "../../../types/Primitives";
import { RoadModelProperties } from "../../../types/entities/RoadModel";

export class RoadModel implements RoadModelProperties {
  boardXPos: number;
  boardYPos: number;
  playerNum: PlayerNumber;
  hexEdgeNumber: number;

  constructor(
    boardXPos: number,
    boardYPos: number,
    playerNum: PlayerNumber,
    hexEdgeNumber: number
  ) {
    this.boardXPos = boardXPos;
    this.boardYPos = boardYPos;
    this.playerNum = playerNum;
    this.hexEdgeNumber = hexEdgeNumber;
  }
}
