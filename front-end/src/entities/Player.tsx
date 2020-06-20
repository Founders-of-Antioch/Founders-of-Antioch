import { Building } from "./Building";
import { RoadModel } from "./RoadModel";
import { ResourceString, PlayerNumber } from "../../../types/Primitives";
import { PlayerProperties } from "../../../types/entities/Player";
import DevCard from "./DevCard";

// Should be moved into helper and given Array<ResourceString> type
export const LIST_OF_RESOURCES: Array<ResourceString> = [
  "wood",
  "brick",
  "ore",
  "sheep",
  "wheat",
];

export class Player implements PlayerProperties {
  playerNum: PlayerNumber;
  victoryPoints: number;
  buildings: Array<Building>;
  roads: Array<RoadModel>;
  knights: number;
  resourceHand: Map<string, number>;
  devCardHand: Array<DevCard>;

  constructor(playNum: PlayerNumber) {
    this.playerNum = playNum;
    this.victoryPoints = 0;
    this.buildings = [];
    this.roads = [];
    this.knights = 0;
    this.resourceHand = new Map();
    this.devCardHand = [];

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
    this.devCardHand = [...p.devCardHand];
  }

  addResource(res: ResourceString) {
    this.changeResourceVal(res, 1);
  }

  numberOfCardsInHand() {
    let sum = 0;

    this.resourceHand.forEach((val) => {
      sum += val;
    });

    return sum;
  }

  changeResourceVal(res: ResourceString, val: number) {
    const stored = this.resourceHand.get(res);
    if (typeof stored === "number") {
      this.resourceHand.set(res, stored + val);
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
