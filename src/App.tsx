import React from "react";
// import './App.css';
import { Board, widthOfSVG, heightOfSVG } from "./components/Board";
import test from "./tester.jpg";
import { Dice, diceLength } from "./components/Dice";
import {
  PlayerCard,
  playerCardWidth,
  playerCardHeight,
} from "./components/PlayerCard";
import { FoAButton } from "./components/FoAButton";
import socketIOClient from "socket.io-client";
import HighlightPoint from "./components/HighlightPoint";
import { Building } from "./entities/Building";
import { Settlement } from "./components/Settlement";
import Road from "./components/Road";
import { RoadModel } from "./entities/RoadModel";
import { PLAYER_COLORS } from "./colors";
import { Player, LIST_OF_RESOURCES } from "./entities/Player";
import { ResourceCard } from "./components/ResourceCard";
import { TileModel } from "./entities/TIleModel";
import { createStore } from "redux";
import FoApp from "./reducers";
import { changePlayer, PlayerNumbers } from "./Actions";

const store = createStore(FoApp);

console.log(store.getState());

const unsubscribe = store.subscribe(() => console.log(store.getState()));

store.dispatch(changePlayer(4));

unsubscribe();

export const socket = socketIOClient.connect("http://localhost:3001");

// TODO: Take some of the things that shouldn't be mutated out into props
// e.g. inGamePlayerNum
type AppState = {
  isLoading: boolean;
  boardToBePlayed: {
    listOfTiles: Array<TileModel>;
    gameID: number;
  };
  // Number 1-4 representing which 'player' is currently taking their turn
  currentPersonPlaying: number;
  canEndTurn: boolean;
  // Number 1-4 representing which player the client is
  inGamePlayerNum: number;
  hasRolled: boolean;
  isCurrentlyPlacingSettlement: boolean;
  isCurrentlyPlacingRoad: boolean;
  currentTurnNumber: number;
  listOfPlayers: Array<Player>;
};
let hasSeeded = false;
export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    let players = [];
    for (let i: PlayerNumbers = 1; i <= 4; i++) {
      players.push(new Player(i));
    }

    this.state = {
      isLoading: true,
      boardToBePlayed: {
        listOfTiles: [],
        gameID: -1,
      },
      currentPersonPlaying: -1,
      canEndTurn: false,
      inGamePlayerNum: -1,
      hasRolled: false,
      isCurrentlyPlacingSettlement: true,
      isCurrentlyPlacingRoad: false,
      currentTurnNumber: 1,
      listOfPlayers: players,
    };

    // Probably change to arrow functions to we don't have to do this
    this.endTurn = this.endTurn.bind(this);
    this.hasRolled = this.hasRolled.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.changeCurrentPlayer = this.changeCurrentPlayer.bind(this);
    this.joinedGame = this.joinedGame.bind(this);
    this.processBuildingUpdate = this.processBuildingUpdate.bind(this);
    this.processTurnUpdate = this.processTurnUpdate.bind(this);
    this.selectSettlementSpotCB = this.selectSettlementSpotCB.bind(this);
    this.selectRoadSpotCB = this.selectRoadSpotCB.bind(this);
    this.evaluateEndTurnEligibility = this.evaluateEndTurnEligibility.bind(
      this
    );
    this.processGetGame = this.processGetGame.bind(this);
    this.processRoadUpdate = this.processRoadUpdate.bind(this);
    this.renderRoads = this.renderRoads.bind(this);
    this.distributeResources = this.distributeResources.bind(this);

    this.setupSockets();
    this.getBoardOne();
  }

  componentDidMount() {
    this.seed();
  }

  // TODO: Move to backend
  seed() {
    if (!hasSeeded) {
      socket.emit("setSeedMode");

      let players = [];
      for (let i = 1; i <= 4; i++) {
        players.push(new Player(i));
      }

      for (let i = 0; i < 4; i++) {
        socket.emit("joinGame", "1");
      }

      // x,y,corner,playnum
      const buildingSeed = [
        new Building(0, 0, 0, 1),
        new Building(0, 0, 2, 1),
        new Building(1, 1, 2, 2),
        new Building(2, 0, 5, 2),
        new Building(-2, -2, 0, 3),
        new Building(-1, -1, 2, 3),
        new Building(0, 2, 2, 4),
        new Building(0, 0, 4, 4),
      ];

      for (const build of buildingSeed) {
        // socket.emit(
        //   "addBuilding",
        //   "1",
        //   build.boardXPos,
        //   build.boardYPos,
        //   build.corner,
        //   build.playerNum
        // );
        players[build.playerNum - 1].buildings.push(build);
      }

      for (let i = 0; i < 8; i++) {
        socket.emit("endTurn", String(this.state.boardToBePlayed.gameID));
      }

      this.setState({
        listOfPlayers: players,
        currentTurnNumber: 3,
        currentPersonPlaying: 1,
        isCurrentlyPlacingSettlement: false,
        inGamePlayerNum: 1,
      });

      hasSeeded = true;
    }
  }

  // Callback for socket event, see "setupSockets"
  // Changes the current person playing when the backend sends an update
  changeCurrentPlayer(playNum: number) {
    this.setState({
      ...this.state,
      currentPersonPlaying: playNum,
    });
  }

  // Callback for socket event, see "setupSockets"
  // Once the player 'enters' the game, it assigns them a player number from the backend
  joinedGame(playerNum: number) {
    if (this.state.inGamePlayerNum === -1) {
      this.setState({
        ...this.state,
        inGamePlayerNum: playerNum,
      });
    }
  }

  // Callback for socket event, see "setupSockets"
  // Backend sockets will send turn updates, and this moves the state to the next player
  processTurnUpdate(nextPlayer: number, incomingTurnNumber: number) {
    const { inGamePlayerNum } = this.state;

    this.setState({
      ...this.state,
      currentPersonPlaying: nextPlayer,
      // Is true if it's still in the snake draft and it's the player's turn
      isCurrentlyPlacingSettlement:
        inGamePlayerNum === nextPlayer && incomingTurnNumber <= 2,
      currentTurnNumber: incomingTurnNumber,
    });
  }

  // Returns an array of TileModel representing the resources the building touches
  tilesBuildingIsOn(knownBuilding: Building) {
    const { boardToBePlayed } = this.state;

    let adjTiles: Array<TileModel> = [];
    // https://www.redblobgames.com/grids/hexagons/#neighbors
    let directions = [
      [1, 1],
      [1, 0],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [0, 1],
    ];

    // This filters out checking for any tiles that are not touching the building
    directions = directions.filter((el, idx) => {
      const checkOne = knownBuilding.corner;
      let checkTwo = checkOne - 1;
      if (checkTwo === -1) {
        checkTwo = 5;
      }

      return idx === checkOne || idx === checkTwo;
    });
    // Count the tile it is on as well
    directions.push([0, 0]);

    for (const currDirection of directions) {
      const expecX = currDirection[0] + knownBuilding.boardXPos;
      const expecY = currDirection[1] + knownBuilding.boardYPos;

      for (const currTile of boardToBePlayed.listOfTiles) {
        if (currTile.boardXPos === expecX && currTile.boardYPos === expecY) {
          adjTiles.push(currTile);
        }
      }
    }
    // console.log(knownBuilding);
    // console.log(adjTiles);

    return adjTiles;
  }

  processBuildingUpdate(building: {
    boardXPos: number;
    boardYPos: number;
    corner: number;
    playerNum: PlayerNumbers;
  }) {
    const build = new Building(
      building.boardXPos,
      building.boardYPos,
      building.corner,
      building.playerNum
    );
    const { listOfPlayers, boardToBePlayed } = this.state;

    // Buckle up for this grossness
    // See https://stackoverflow.com/questions/37662708/react-updating-state-when-state-is-an-array-of-objects
    const updatedPlayer = new Player(build.playerNum);
    updatedPlayer.copyFromPlayer(listOfPlayers[build.playerNum - 1]);
    console.log(build);
    updatedPlayer.buildings.push(build);

    let newListOfTiles = [];
    for (const oldTile of boardToBePlayed.listOfTiles) {
      const addTile = new TileModel(
        oldTile.resource,
        oldTile.counter,
        oldTile.boardXPos,
        oldTile.boardYPos
      );
      // addTile.copyOverBuildings(oldTile);

      // Needs fixing for surrouding tiles
      // if (
      //   oldTile.boardXPos === build.boardXPos &&
      //   oldTile.boardYPos === build.boardYPos
      // ) {
      //   addTile.buildings.push(build);
      // }

      newListOfTiles.push(addTile);
    }
    // console.log(this.tilesBuildingIsOn(build));

    // Push copy to state
    this.setState({
      ...this.state,
      listOfPlayers: [
        ...listOfPlayers.slice(0, build.playerNum - 1),
        updatedPlayer,
        ...listOfPlayers.slice(build.playerNum),
      ],
      boardToBePlayed: {
        gameID: boardToBePlayed.gameID,
        listOfTiles: newListOfTiles,
      },
    });
  }

  renderBuildings(): Array<any> {
    let buildingArr = [];
    let key = 0;

    for (const p of this.state.listOfPlayers) {
      for (const i of p.buildings) {
        buildingArr.push(
          <Settlement
            key={key++}
            boardXPos={i.boardXPos}
            boardYPos={i.boardYPos}
            color={PLAYER_COLORS[i.playerNum - 1]}
            corner={i.corner}
          />
        );
      }
    }

    return buildingArr;
  }

  // Sets up basic socket listeners and initalizers
  setupSockets() {
    // Listens for whose turn in the game it is. Every time it changes, it will go to changeCurrentPlayer
    // Listens for the response to 'whose turn is it' (below)
    socket.on("getWhoseTurnItIs", this.changeCurrentPlayer);

    // Start off by joining the game, ID
    socket.emit("joinGame", "1");
    // This is essentially an API call, we ask whose turn it is and then it will send the result back up to ^
    // 'get whose turn it is' which processes the response
    socket.emit("whoseTurnIsIt", "1");

    // Backend sends an event once the player has joined
    socket.on("joinedGame", this.joinedGame);
    // Backend sends an event when the turn changes
    socket.on("turnUpdate", this.processTurnUpdate);
    // Backend sends an event when someone places a new building
    socket.on("buildingUpdate", this.processBuildingUpdate);
    // Backend sends an event when someone places a new road
    socket.on("roadUpdate", this.processRoadUpdate);

    socket.on("giveGame", this.processGetGame);
  }

  processRoadUpdate(r: RoadModel) {
    const { listOfPlayers } = this.state;
    listOfPlayers[r.playerNum - 1].roads.push(r);

    // Basically same as processBuildingUpdate
    const updatedPlayer = new Player(r.playerNum);
    updatedPlayer.copyFromPlayer(listOfPlayers[r.playerNum - 1]);
    updatedPlayer.roads.push(r);

    // Push copy to state
    this.setState({
      ...this.state,
      listOfPlayers: [
        ...listOfPlayers.slice(0, r.playerNum - 1),
        updatedPlayer,
        ...listOfPlayers.slice(r.playerNum),
      ],
    });
  }

  processGetGame(game: {
    currentPersonPlaying: number;
    counters: Array<string>;
    resources: Array<string>;
  }) {
    if (this.state.isLoading) {
      let tileList: Array<TileModel> = [];
      let resIdx = 0;

      for (let x = 2; x >= -2; x--) {
        const numRows = 5 - Math.abs(x);
        let y = 2;
        if (x < 0) {
          y -= Math.abs(x);
        }

        let numRowsDone = 0;
        for (; numRowsDone < numRows; y--) {
          const resourceToAdd = game.resources[resIdx++];
          let counterToAdd = -1;
          if (resourceToAdd !== "desert") {
            counterToAdd = Number(game.counters.pop());
          }

          const tileToAdd = new TileModel(resourceToAdd, counterToAdd, x, y);
          tileList.push(tileToAdd);
          numRowsDone++;
        }
      }

      // TODO: Fix GameID
      this.setState({
        ...this.state,
        isLoading: false,
        boardToBePlayed: {
          listOfTiles: tileList,
          gameID: 1,
        },
      });
    }
  }

  distributeResources(diceSum: number) {
    const { listOfPlayers, boardToBePlayed } = this.state;
    console.log(this.state);

    // We have to copy over because state should be 'immutable' see issue #30 on GH for more details
    let newPlayersList = [];
    for (const oldPlayer of listOfPlayers) {
      const addPlayer = new Player(oldPlayer.playerNum);
      addPlayer.copyFromPlayer(oldPlayer);
      newPlayersList.push(addPlayer);
    }

    for (const currPlayer of newPlayersList) {
      for (const currBuilding of currPlayer.buildings) {
        // Need to look out for doubling counting
        const buildingTiles = this.tilesBuildingIsOn(currBuilding);
        for (const currTile of buildingTiles) {
          if (currTile.counter === diceSum) {
            currPlayer.addResource(currTile.resource);
          }
        }
      }
    }
    console.log(newPlayersList);

    this.setState(
      {
        ...this.state,
        listOfPlayers: [...newPlayersList],
      },
      () => console.log(this.state.listOfPlayers)
    );
  }

  // Callback function for the 'Dice' component
  hasRolled(diceSum: number) {
    this.distributeResources(diceSum);
    // evaluateTurnElg is callback after setState
    this.setState(
      {
        ...this.state,
        hasRolled: true,
      },
      this.evaluateEndTurnEligibility
    );
  }

  // Determines if the player can end their turn or not
  evaluateEndTurnEligibility() {
    const {
      hasRolled,
      isCurrentlyPlacingSettlement,
      currentTurnNumber,
      isCurrentlyPlacingRoad,
    } = this.state;
    if (
      (hasRolled || currentTurnNumber <= 2) &&
      !isCurrentlyPlacingSettlement &&
      !isCurrentlyPlacingRoad
    ) {
      this.setState({
        ...this.state,
        canEndTurn: true,
      });
    }
  }

  // Ends the players turn
  // Should only be used as callback for the end turn button
  endTurn() {
    socket.emit("endTurn", String(this.state.boardToBePlayed.gameID));
    this.setState({
      ...this.state,
      canEndTurn: false,
      hasRolled: false,
    });
  }

  getBoardOne() {
    // TODO: Fix ID
    // socket.emit("needCounters", "1");
    // socket.emit("needResources", "1");
    socket.emit("needGame", "1");
  }

  // Returns the end turn button component
  endTurnButton() {
    // Only render the button if it is the player's turn
    // You can only end your turn if it IS your turn
    if (this.state.currentPersonPlaying === this.state.inGamePlayerNum) {
      return (
        <FoAButton
          onClick={this.endTurn}
          canEndTurn={this.state.canEndTurn}
          // TODO: Change for dynamic size
          width={175}
          height={50}
        />
      );
    }
  }

  // Callback for when a player is done selecting where their settlement should go
  selectSettlementSpotCB() {
    this.setState(
      {
        isCurrentlyPlacingSettlement: false,
        isCurrentlyPlacingRoad: this.state.currentTurnNumber <= 2,
      },
      this.evaluateEndTurnEligibility
    );
  }

  // Callback for when a player is done selecting where the road should go
  selectRoadSpotCB() {
    this.setState(
      {
        isCurrentlyPlacingRoad: false,
      },
      this.evaluateEndTurnEligibility
    );
  }

  // Highlights the available places to put settlements
  highlightSettlingSpaces(typeofHighlight: string) {
    const {
      currentPersonPlaying,
      inGamePlayerNum,
      isCurrentlyPlacingSettlement,
      isCurrentlyPlacingRoad,
      listOfPlayers,
    } = this.state;

    const isTurn = currentPersonPlaying === inGamePlayerNum;
    const placing =
      typeofHighlight === "road"
        ? isCurrentlyPlacingRoad
        : isCurrentlyPlacingSettlement;
    const callback =
      typeofHighlight === "road"
        ? this.selectRoadSpotCB
        : this.selectSettlementSpotCB;

    if (isTurn && placing) {
      const spots = [];
      let keyForHighlights = 0;

      for (let x = 2; x >= -2; x--) {
        const numRows = 5 - Math.abs(x);
        let y = 2;
        if (x < 0) {
          y -= Math.abs(x);
        }

        let numRowsDone = 0;
        for (; numRowsDone < numRows; y--) {
          cornerLoop: for (let corner = 0; corner <= 5; corner++) {
            // If there is already a building in the spot, don't highlight it
            for (const pl of listOfPlayers) {
              for (const setl of pl.buildings) {
                if (
                  x === setl.boardXPos &&
                  y === setl.boardYPos &&
                  corner === setl.corner
                ) {
                  continue cornerLoop;
                }
              }
            }

            spots.push(
              <HighlightPoint
                key={keyForHighlights++}
                boardXPos={x}
                boardYPos={y}
                corner={corner}
                finishedSelectingCallback={callback}
                playerWhoSelected={inGamePlayerNum}
                typeOfHighlight={typeofHighlight}
              />
            );
          }

          numRowsDone++;
        }
      }
      return spots;
    }
  }

  renderDice() {
    const {
      currentTurnNumber,
      inGamePlayerNum,
      currentPersonPlaying,
    } = this.state;

    // Only render the dice if we're done with initial placements
    if (currentTurnNumber > 2) {
      return (
        <Dice
          hasRolled={this.state.hasRolled}
          isPlayersTurn={inGamePlayerNum === currentPersonPlaying}
          hasRolledCallBack={this.hasRolled}
          diceOneX={(widthOfSVG * 4) / 5}
          diceOneY={heightOfSVG / 2 - diceLength / 2}
        />
      );
    }
  }

  highlightNeededSpaces() {
    const { isCurrentlyPlacingSettlement, isCurrentlyPlacingRoad } = this.state;
    if (isCurrentlyPlacingRoad) {
      return this.highlightSettlingSpaces("road");
    } else if (isCurrentlyPlacingSettlement) {
      return this.highlightSettlingSpaces("settlement");
    }
  }

  renderRoads() {
    const { listOfPlayers } = this.state;
    let roadArr = [];
    let key = 0;

    for (const p of listOfPlayers) {
      for (const r of p.roads) {
        roadArr.push(
          <Road
            key={key++}
            boardXPos={r.boardXPos}
            boardYPos={r.boardYPos}
            hexEdge={r.hexEdgeNumber}
            playerNum={r.playerNum}
          />
        );
      }
    }

    return roadArr;
  }

  generateAllPlayerCards() {
    const { listOfPlayers, currentPersonPlaying, inGamePlayerNum } = this.state;

    let playerCards = [];
    let key = 0;
    let topX = 0;

    for (let x = 0; x < 4; x++) {
      if (x === inGamePlayerNum - 1) {
        playerCards.push(
          <PlayerCard
            key={key++}
            bkgX={widthOfSVG / 2 - playerCardWidth / 2}
            bkgY={heightOfSVG - playerCardHeight}
            playerModel={listOfPlayers[key - 1]}
            currentPersonPlaying={currentPersonPlaying}
          />
        );
      } else {
        // Junk but equally distributes three cards across top
        let currX = (widthOfSVG - playerCardWidth) * (topX++ / 2);
        let currY = 0;

        playerCards.push(
          <PlayerCard
            key={key++}
            bkgX={currX}
            bkgY={currY}
            playerModel={listOfPlayers[key - 1]}
            currentPersonPlaying={currentPersonPlaying}
          />
        );
      }
    }

    return playerCards;
  }

  generateResourceCards() {
    console.log(this.state.listOfPlayers);
    let key = 0;

    const cardWidth = widthOfSVG / 15;
    const cardHeight = (cardWidth * 4) / 3;
    let cardX = widthOfSVG * 0.01;
    const cardY = heightOfSVG - cardHeight;

    let resCardArr = [];
    for (const res of LIST_OF_RESOURCES) {
      const resAmount = this.state.listOfPlayers[
        this.state.inGamePlayerNum - 1
      ].getNumberOfResources(res);

      resCardArr.push(
        <ResourceCard
          x={cardX}
          y={cardY}
          key={key++}
          resource={res}
          amount={resAmount}
        />
      );
      cardX += widthOfSVG * 0.05;
    }

    return resCardArr;
  }

  render() {
    const { isLoading } = this.state;

    // If this isn't null, React breaks the CSS ¯\_(ツ)_/¯
    // Should find a way to fix this/have a decent loading icon or screen
    if (isLoading) {
      return null;
    } else {
      const { boardToBePlayed } = this.state;
      return (
        <svg width="100%" height="100%">
          {/* <rect width="100%" height="100%" fill="#00a6e4"></rect> */}
          <image
            href={test}
            x="0"
            y="0"
            preserveAspectRatio="none"
            width="100%"
            height="100%"
          />
          <Board listOfTiles={boardToBePlayed.listOfTiles} />
          {this.renderDice()}
          {this.generateAllPlayerCards()}
          {this.endTurnButton()}
          {this.highlightNeededSpaces()}
          {this.renderRoads()}
          {this.renderBuildings()}
          {this.generateResourceCards()}
        </svg>
      );
    }
  }
}
