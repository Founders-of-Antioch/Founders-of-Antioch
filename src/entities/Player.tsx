import { Building } from "./Building";
import { RoadModel } from "./RoadModel";

export class Player {
  playerNum: number;
  victoryPoints: number;
  buildings: Array<Building>;
  roads: Array<RoadModel>;
  contiguousRoads: number;
  knights: number;
  // cards
  // dev cards

  constructor(playNum: number) {
    this.playerNum = playNum;
    this.victoryPoints = 0;
    this.buildings = [];
    this.roads = [];
    this.contiguousRoads = 0;
    this.knights = 0;
  }

  // Someone please fix this garbage
  copyFromPlayer(p: Player) {
    this.victoryPoints = p.victoryPoints;
    this.buildings = [...p.buildings];
    this.roads = [...p.roads];
    this.contiguousRoads = p.contiguousRoads;
    this.knights = p.knights;
  }
}
