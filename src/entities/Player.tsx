import { Building } from "./Building";
import { RoadModel } from "./RoadModel";

// Should be moved into helper
export const LIST_OF_RESOURCES = ["wood", "brick", "ore", "sheep", "wheat"];

export class Player {
  playerNum: number;
  victoryPoints: number;
  buildings: Array<Building>;
  roads: Array<RoadModel>;
  contiguousRoads: number;
  knights: number;
  resourceHand: Map<string, number>;
  // cards
  // dev cards

  constructor(playNum: number) {
    this.playerNum = playNum;
    this.victoryPoints = 0;
    this.buildings = [];
    this.roads = [];
    this.contiguousRoads = 0;
    this.knights = 0;
    this.resourceHand = new Map();

    for (const res of LIST_OF_RESOURCES) {
      this.resourceHand.set(res, 0);
    }
  }

  // Someone please fix this garbage
  copyFromPlayer(p: Player) {
    this.victoryPoints = p.victoryPoints;
    this.buildings = [...p.buildings];
    this.roads = [...p.roads];
    this.contiguousRoads = p.contiguousRoads;
    this.knights = p.knights;
    this.resourceHand = new Map(this.resourceHand);
  }

  addResource(res: string) {
    const stored = this.resourceHand.get(res);
    console.log(res);
    if (typeof stored === "number") {
      this.resourceHand.set(res, stored + 1);
    }
  }

  getNumberOfResources(res: string): number {
    const stored = this.resourceHand.get(res);
    if (typeof stored === "number") {
      return stored;
    } else {
      return -1;
    }
  }
}
