import { Socket } from "socket.io";
import { Building } from "./Building";
import { Road } from "./entity/Road";

export class Player {
  playerSocket: Socket;
  victoryPoints: number;
  settlements: Array<Building>;
  roads: Array<Road>;
  resourceHand: Map<string, number>;

  constructor(sock: Socket) {
    this.playerSocket = sock;
    this.victoryPoints = 0;
    this.settlements = [];
    this.roads = [];

    let hands = new Map<string, number>();
    const LIST_OF_RESOURCES = ["wood", "brick", "ore", "sheep", "wheat"];
    for (const currRes of LIST_OF_RESOURCES) {
      hands.set(currRes, 0);
    }
    this.resourceHand = hands;
  }

  addSettlement(build: Building): void {
    this.settlements = this.settlements.concat(build);
    this.victoryPoints++;
  }

  addRoad(r: Road) {
    this.roads = this.roads.concat(r);
  }

  addResources(res: Array<string>) {
    for (const currRes of res) {
      const currVal = this.resourceHand.get(currRes);
      if (currVal !== undefined) {
        this.resourceHand.set(currRes, currVal + 1);
      }
    }
  }
}
