import { Building } from "./Building";
import { RoadModel } from "./RoadModel";
import { ResourceString, PlayerNumber } from "../../../types/Primitives";
import { PlayerProperties } from "../../../types/entities/Player";
import DevCard from "./DevCard";
import { getOneAwayRoadSpots } from "./TilePointHelper";
import RoadPoint from "./Points/RoadPoint";
import { PORT_MODELS } from "../components/Ports/PortSet";

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
  // TODO: Change to resource string
  // Can't atm because sending this over packages doesn't seem to work
  resourceHand: Map<string, number>;
  devCardHand: Array<DevCard>;
  hasLargestArmy: boolean;
  hasLongestRoad: boolean;

  constructor(playNum: PlayerNumber) {
    this.playerNum = playNum;
    this.victoryPoints = 0;
    this.buildings = [];
    this.roads = [];
    this.knights = 0;
    this.resourceHand = new Map();
    this.devCardHand = [];
    this.hasLargestArmy = false;
    this.hasLongestRoad = false;

    for (const res of LIST_OF_RESOURCES) {
      this.resourceHand.set(res, 0);
    }
  }

  // Someone please fix this garbage
  // But it's just for redux, fyi
  copyFromPlayer(p: Player) {
    this.victoryPoints = p.victoryPoints;
    this.buildings = [...p.buildings];
    this.roads = [...p.roads];
    this.knights = p.knights;
    this.resourceHand = new Map([...p.resourceHand]);
    this.devCardHand = [...p.devCardHand];
    this.hasLargestArmy = p.hasLargestArmy;
    this.hasLongestRoad = p.hasLongestRoad;
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

  // Gets, but does not take, a random resource
  // Used to read possible resources for stealing
  getRandomResource() {
    let arrOfRes = [];

    for (const currRes of this.resourceHand.keys()) {
      const currVal = this.resourceHand.get(currRes);
      if (currVal !== 0 && currVal !== undefined) {
        for (let i = 0; i < currVal; i++) {
          arrOfRes.push(currRes);
        }
      }
    }

    const randomResource =
      arrOfRes[Math.floor(Math.random() * arrOfRes.length)];

    return randomResource;
  }

  stealResource(res: string) {
    const curr = this.resourceHand.get(res);
    if (curr !== undefined && curr !== 0) {
      this.resourceHand.set(res, curr - 1);
    }
  }

  takeLargestArmy() {
    this.hasLargestArmy = true;
    this.victoryPoints += 2;
  }

  loseLargestArmy() {
    this.hasLargestArmy = false;
    this.victoryPoints -= 2;
  }

  takeLongestRoad() {
    this.hasLongestRoad = true;
    this.victoryPoints += 2;
  }

  loseLongestRoad() {
    this.hasLongestRoad = false;
    this.victoryPoints -= 2;
  }

  getAdjacentRoads(r: RoadPoint) {
    let arr = [];

    const oneAways = getOneAwayRoadSpots(r);
    for (const adjRoad of oneAways) {
      for (const currRoad of this.roads) {
        if (currRoad.point.equals(adjRoad)) {
          arr.push(adjRoad);
        }
      }
    }

    return arr;
  }

  pathLength(r: RoadPoint, visited: Array<RoadPoint>, length: number): number {
    const adjRoads = this.getAdjacentRoads(r);
    outer: for (const adj of adjRoads) {
      for (const visit of visited) {
        if (adj.equals(visit)) {
          continue outer;
        }
      }
      return this.pathLength(adj, visited.concat(r), length + 1);
    }

    return length;
  }

  contiguousRoads() {
    let max = 0;
    for (const currRoad of this.roads) {
      const currLen = this.pathLength(currRoad.point, [], 1);
      if (currLen > max) {
        max = currLen;
      }
    }

    return max;
  }

  ports() {
    let portArr = [];

    for (const build of this.buildings) {
      for (const port of PORT_MODELS) {
        if (build.point.equals(port.point)) {
          portArr.push(port);
        }
      }
    }

    return portArr;
  }

  hasAvailableResources(resMap: { [index: string]: number }) {
    for (const currRes in resMap) {
      const currVal = this.resourceHand.get(currRes);
      if (currVal !== undefined && currVal < resMap[currRes]) {
        return false;
      }
    }

    return true;
  }
}
