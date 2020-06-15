import { ServerPlayer } from "./Player";
import { ServerBuilding } from "./Building";
import { Road } from "./entity/Road";
import { ProposedTradeSocketPackage } from "../../front-end/src/components/Trading/ProposeTrade";

// Stolen from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a: Array<string>): Array<string> {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randResources() {
  let resourcesSequence = ["desert"];
  for (let i = 0; i < 4; i++) {
    resourcesSequence = resourcesSequence
      .concat("wood")
      .concat("sheep")
      .concat("wheat");
  }
  for (let i = 0; i < 3; i++) {
    resourcesSequence = resourcesSequence.concat("brick").concat("ore");
  }

  return shuffle(resourcesSequence);
}

function randCounters() {
  let counterSequence = ["2", "12"];
  for (let i = 0; i < 2; i++) {
    for (let j = 3; j < 12; j++) {
      if (j === 7) {
        continue;
      } else {
        counterSequence.push(String(j));
      }
    }
  }

  return shuffle(counterSequence);
}

export class Game {
  listOfPlayers: Array<ServerPlayer>;
  currentPersonPlaying: number;
  counters: Array<string>;
  resources: Array<string>;
  // Number that changes every time all four players have gone
  currentTurnNumber: number;

  constructor() {
    this.listOfPlayers = [];
    this.currentPersonPlaying = 1;
    this.counters = randCounters();
    this.resources = randResources();
    this.currentTurnNumber = 1;
  }

  addPlayer(p: ServerPlayer): boolean {
    if (this.listOfPlayers.length === 4) {
      return false;
    } else {
      this.listOfPlayers = this.listOfPlayers.concat(p);
      return true;
    }
  }

  // Ends the turn for `this` game
  endTurn(): number {
    // All of these cases account for the 'snake' draft of placing settlements at the beginning
    // If we get to the fourth person on the first turn, the turn changes, but the player stays the same
    if (this.currentTurnNumber === 1 && this.currentPersonPlaying === 4) {
      this.currentTurnNumber++;
    }
    // If it is the end of the snake draft, then increase the turn number, but don't change the player
    else if (this.currentTurnNumber === 2 && this.currentPersonPlaying === 1) {
      this.currentTurnNumber++;
    }
    // If it is the middle of the second part of the snake draft, go down instead of up
    else if (this.currentTurnNumber === 2) {
      this.currentPersonPlaying--;
    }
    // Normal playing, if we get to 4, reset
    else if (this.currentPersonPlaying === 4) {
      this.currentPersonPlaying = 1;
      this.currentTurnNumber++;
    }
    // Normal play, just go to the next player
    else {
      this.currentPersonPlaying += 1;
    }

    this.broadcastTurnUpdate();
    return this.currentPersonPlaying;
  }

  // Tells all of the connected players that someone ended their turn
  broadcastTurnUpdate(): void {
    for (const i of this.listOfPlayers) {
      i.playerSocket.emit(
        "turnUpdate",
        this.currentPersonPlaying,
        this.currentTurnNumber
      );
    }
  }

  // Tells all of the players that someone rolled
  broadcastDiceUpdate(d1: number, d2: number): void {
    for (const i of this.listOfPlayers) {
      i.playerSocket.emit("diceUpdate", d1, d2);
    }
  }

  // Tells all of the players someone built something
  broadcastBuildingUpdate(b: ServerBuilding): void {
    for (const i of this.listOfPlayers) {
      i.playerSocket.emit("buildingUpdate", b);
    }
  }

  broadcastRoadUpdate(r: Road): void {
    for (const i of this.listOfPlayers) {
      i.playerSocket.emit("roadUpdate", r);
    }
  }

  broadcastTradeUpdate(pkg: ProposedTradeSocketPackage) {
    this.listOfPlayers.forEach((currPl, idx) => {
      if (idx + 1 !== pkg.playerNumber) {
        currPl.playerSocket.emit("tradeProposed", pkg);
      }
    });
  }
}

export class GameManager {
  mapOfGames: Map<string, Game>;

  constructor() {
    this.mapOfGames = new Map();
    this.mapOfGames.set("1", new Game());
  }

  getGame(gameID: string) {
    const getGame = this.mapOfGames.get(gameID);
    if (getGame) {
      return getGame;
    } else {
      console.log(`Game with ID ${gameID} not found`);
      return null;
    }
  }

  getResources(gameID: string) {
    const getGame = this.mapOfGames.get(gameID);
    if (getGame) {
      return getGame.resources;
    }
  }

  getCounters(gameID: string) {
    const getGame = this.mapOfGames.get(gameID);
    if (getGame) {
      return getGame.counters;
    }
  }

  addPlayerToGame(gameID: string, p: ServerPlayer): boolean {
    const getGame = this.mapOfGames.get(gameID);
    if (getGame) {
      return getGame.addPlayer(p);
    } else {
      return false;
    }
  }

  numPlayersInGame(gameID: string): number {
    const getGame = this.mapOfGames.get(gameID);
    if (getGame) {
      return getGame.listOfPlayers.length;
    } else {
      return -1;
    }
  }

  endTurn(gameID: string): number {
    const getGame = this.mapOfGames.get(gameID);
    if (getGame) {
      return getGame.endTurn();
    } else {
      return -1;
    }
  }

  whoseTurnIsIt(gameID: string): number {
    const getGame = this.mapOfGames.get(gameID);
    if (getGame) {
      return getGame.currentPersonPlaying;
    } else {
      return -1;
    }
  }

  updateDice(d1: number, d2: number, gameID: string): void {
    const getGame = this.mapOfGames.get(gameID);
    if (getGame) {
      getGame.broadcastDiceUpdate(d1, d2);
    }
  }

  addBuilding(build: ServerBuilding, gameID: string): boolean {
    const getGame = this.mapOfGames.get(gameID);
    if (getGame) {
      // Player numbers are 1 to 4, -1 is for indexing
      getGame.listOfPlayers[build.playerNum - 1].addSettlement(build);
      getGame.broadcastBuildingUpdate(build);
      return true;
    } else {
      return false;
    }
  }

  addRoad(road: Road, gameID: string) {
    const getGame = this.mapOfGames.get(gameID);

    if (getGame) {
      getGame.listOfPlayers[road.playerNum - 1].addRoad(road);
      getGame.broadcastRoadUpdate(road);
      return true;
    } else {
      return false;
    }
  }

  addResources(res: Array<string>, pNum: number, gameID: string) {
    const getGame = this.mapOfGames.get(gameID);

    if (getGame) {
      getGame.listOfPlayers[pNum - 1].addResources;
    }
  }

  proposeTrade(pkg: ProposedTradeSocketPackage) {
    const getGame = this.mapOfGames.get(pkg.gameID);

    if (getGame) {
      getGame.broadcastTradeUpdate(pkg);
    }
  }
}
