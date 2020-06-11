import { Socket } from "socket.io";
import { ServerBuilding } from "./ServerBuilding";
import { Road } from "./entity/Road";

export class ServerPlayer {
  playerSocket: Socket;
  victoryPoints: number;
  settlements: Array<ServerBuilding>;
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

  addSettlement(build: ServerBuilding): void {
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
