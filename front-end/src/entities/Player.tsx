import { Building } from "./Building";
import { RoadModel } from "./RoadModel";
import { PlayerNumber, ResourceString } from "../redux/Actions";

// Should be moved into helper and given Array<ResourceString> type
export const LIST_OF_RESOURCES: Array<ResourceString> = [
  "wood",
  "brick",
  "ore",
  "sheep",
  "wheat",
];

export class Player {
  playerNum: PlayerNumber;
  victoryPoints: number;
  buildings: Array<Building>;
  roads: Array<RoadModel>;
  knights: number;
  // TODO: Change key type to ResourceString
  resourceHand: Map<string, number>;
  // cards
  // dev cards

  constructor(playNum: PlayerNumber) {
    this.playerNum = playNum;
    this.victoryPoints = 0;
    this.buildings = [];
    this.roads = [];
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
    this.knights = p.knights;
    this.resourceHand = new Map([...p.resourceHand]);
  }

  addResource(res: ResourceString) {
    const stored = this.resourceHand.get(res);
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
