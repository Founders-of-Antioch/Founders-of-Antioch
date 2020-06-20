import * as express from "express";
import * as http from "http";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { createConnection } from "typeorm";
import { Game } from "./src/entity/Game";
import { Board } from "./src/entity/Board";
import * as socketIo from "socket.io";
import * as cors from "cors";
import { ClientManager } from "./src/clientManager";
import { GameManager } from "./src/gameManager";
import { Socket } from "socket.io";
import { ServerPlayer } from "./src/Player";
import { ServerBuilding } from "./src/Building";
import { Road } from "./src/entity/Road";
import {
  ResourceChangePackage,
  ProposedTradeSocketPackage,
  AcquireDevCardPackage,
} from "../types/SocketPackages";
import { PlayerNumber } from "../types/Primitives";

// make typeorm connection
createConnection().then((connection) => {
  // const userRepository = connection.getRepository(User);
  const gameRepository = connection.getRepository(Game);
  const boardRepository = connection.getRepository(Board);
  // const playerRepository = connection.getRepository(Player);

  const clientManager = new ClientManager();
  const gameManager = new GameManager();

  const app = express();

  const server = http.createServer(app);
  const io = socketIo(server);

  let seedMode = false;

  // I think this is the right type? But the internet was not helpful, so please correct this if it's wrong
  io.on("connection", (client: Socket) => {
    if (!seedMode) {
      console.log(`Client ${client.id} connected`);
      clientManager.addClient(client);
    }

    client.on("setSeedMode", () => {
      seedMode = true;
    });

    client.on(
      "roll",
      (diceOneVal: number, diceTwoVal: number, gameID: string) => {
        console.log(`Rolled a ${diceOneVal} and a ${diceTwoVal}`);
        gameManager.updateDice(diceOneVal, diceTwoVal, gameID);
      }
    );

    client.on("joinGame", (gameID: string) => {
      if (gameManager.addPlayerToGame(gameID, new ServerPlayer(client))) {
        console.log(`Client ${client.id} joined game ${gameID}`);
        io.emit("joinedGame", gameManager.numPlayersInGame(gameID));
      }
    });

    client.on("whoseTurnIsIt", (gameID: string) => {
      const playing = gameManager.whoseTurnIsIt(gameID);
      io.emit("getWhoseTurnItIs", playing);
    });

    client.on("endTurn", (gameID: string) => {
      const res = gameManager.endTurn(gameID);
    });

    client.on("needGame", (gameID: string) => {
      const g = gameManager.getGame(gameID);
      if (g) {
        io.emit("giveGame", {
          currentPersonPlaying: g.currentPersonPlaying,
          counters: g.counters,
          resources: g.resources,
          devCards: g.devCardCodes,
        });
      } else {
        console.log("Game not found. Response not emitted");
      }
    });

    client.on("disconnect", () => {
      console.log(`Client ${client.id} disconnected`);
      clientManager.removeClient(client);
    });

    client.on(
      "addBuilding",
      (
        gameID: string,
        boardXPos: number,
        boardYPos: number,
        corner: number,
        playerNum: number
      ) => {
        const location = new ServerBuilding(
          boardXPos,
          boardYPos,
          corner,
          playerNum
        );
        gameManager.addBuilding(location, gameID);
      }
    );

    client.on(
      "addRoad",
      (
        gameID: string,
        boardXPos: number,
        boardYPos: number,
        hexEdgeNumber: number,
        playerNum: number
      ) => {
        const r = new Road(boardXPos, boardYPos, playerNum, hexEdgeNumber);
        gameManager.addRoad(r, gameID);
      }
    );

    // client.on(
    //   "getSeedState",
    //   (listOfTiles: Array<TileModel>): SeedState => {
    //     const listOfBuildings = [
    //       new Building(0, 0, 0, 1, listOfTiles),
    //       new Building(0, 0, 2, 1, listOfTiles),
    //       new Building(1, 1, 2, 2, listOfTiles),
    //       new Building(2, 0, 5, 2, listOfTiles),
    //       new Building(-2, -2, 0, 3, listOfTiles),
    //       new Building(-1, -1, 2, 3, listOfTiles),
    //       new Building(0, 2, 2, 4, listOfTiles),
    //       new Building(0, 0, 4, 4, listOfTiles),
    //     ];

    //     // If someone knows a way around the 'as', please feel free to fix it!
    //     let playersArray: Array<Player> = [];
    //     for (let i = 1; i <= 4; i++) {
    //       const playerToAdd = new Player(i as PlayerNumber);

    //       const b1 = listOfBuildings.pop();
    //       const b2 = listOfBuildings.pop();
    //       if (b1 !== undefined && b2 !== undefined) {
    //         playerToAdd.buildings.push(b1);
    //         playerToAdd.buildings.push(b2);
    //       }

    //       playersArray.push(playerToAdd);
    //     }

    //     const currentPersonPlaying: PlayerNumber = 1;
    //     const inGamePlayerNumber: PlayerNumber = 1;

    //     const retState: SeedState = {
    //       currentPersonPlaying,
    //       inGamePlayerNumber,
    //       hasRolled: false,
    //       turnNumber: 3,
    //       boardToBePlayed: {
    //         listOfTiles,
    //         gameID: "1",
    //       },
    //       playersArray,
    //     };

    //     console.log("Sending Seed");
    //     io.emit("sendSeed", retState);

    //     return retState;
    //   }
    // );

    client.on("proposedTrade", (pkg: ProposedTradeSocketPackage) => {
      gameManager.proposeTrade(pkg);
    });

    client.on("resourceChange", (pkg: ResourceChangePackage) => {
      gameManager.changeResources(pkg);
    });

    client.on(
      "tradeAccepted",
      (tradeIndex: number, tradePlayer: PlayerNumber, gameID: string) => {
        gameManager.acceptTrade(tradeIndex, tradePlayer, gameID);
      }
    );

    client.on("acquireDevelopmentCard", (pkg: AcquireDevCardPackage) => {
      gameManager.acquireDevCard(pkg);
    });
  });

  app.use(bodyParser.json());
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

  //Make a new game - returns the board
  app.post("/games", async function (req: Request, res: Response) {
    let boardForGame = new Board();
    // boardForGame.resources = randResources();
    // boardForGame.counters = randCounters();
    boardForGame.gameID = -1;
    boardForGame = await boardRepository.save(boardForGame);

    let gameToBePlayed = new Game();
    gameToBePlayed.boardID = boardForGame.id;
    // Can modify later to take in a POST param
    gameToBePlayed.numberOfPlayers = 4;
    gameToBePlayed.currentPlayersTurn = 1;
    gameToBePlayed.listOfPlayerIDs = [];

    gameToBePlayed = await gameRepository.save(gameToBePlayed);

    boardForGame.gameID = gameToBePlayed.id;

    boardRepository.save(boardForGame);
    gameToBePlayed = await gameRepository.save(gameToBePlayed);

    boardForGame = await boardRepository.save(boardForGame);

    return res.json(boardForGame);
  });

  app.get("/games", async function (req: Request, res: Response) {
    const games = await gameRepository.find();
    res.json(games);
  });

  app.get("/games/:id", async function (req: Request, res: Response) {
    const results = await gameRepository.findOne(req.params.id);
    return res.send(results);
  });

  // app.put("/newTurn/:gameID&:playerNum", async function (
  //   req: Request,
  //   res: Response
  // ) {
  //   const game = await gameRepository.findOne(req.params.gameID);

  //   await gameRepository.merge(game, {
  //     currentPlayersTurn: Number(req.params.playerNum),
  //   });
  //   const results = await gameRepository.save(game);

  //   return res.send(results);
  // });

  // app.put("/addPlayerToGame/:playerID&gameID", async function (
  //   req: Request,
  //   res: Response
  // ) {
  //   const game = await gameRepository.findOne(req.params.gameID);

  //   gameRepository.merge(game, {
  //     listOfPlayerIDs: game.listOfPlayerIDs.concat(req.params.playerID),
  //   });

  //   const results = await gameRepository.save(game);

  //   return res.send(results);
  // });

  // app.post("/boards", async function (req: Request, res: Response) {
  //   const board = await boardRepository.create(req.body);
  //   const results = await boardRepository.save(board);
  //   return results;
  // });

  app.get("/boards", async function (req: Request, res: Response) {
    const boards = await boardRepository.find();
    res.json(boards);
  });

  app.get("/boards/:id", async function (req: Request, res: Response) {
    const results = await boardRepository.findOne(req.params.id);
    return res.send(results);
  });

  server.listen(3001, () => console.log(`Listening on ${3001}`));
});
