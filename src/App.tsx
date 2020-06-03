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
import { Player } from "./entities/Player";

export const socket = socketIOClient.connect("http://localhost:3001");

// TODO: Take some of the things that shouldn't be mutated out into props
// e.g. inGamePlayerNum
type AppState = {
  isLoading: boolean;
  boardToBePlayed: {
    resources: Array<string>;
    counters: Array<string>;
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

export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    let players = [];
    for (let i = 0; i < 4; i++) {
      players.push(new Player(i + 1));
    }

    this.state = {
      isLoading: true,
      boardToBePlayed: {
        resources: [],
        counters: [],
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

    this.setupSockets();
    this.getBoardOne();
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

  processBuildingUpdate(building: {
    boardXPos: number;
    boardYPos: number;
    corner: number;
    playerNum: number;
  }) {
    const build = new Building(
      building.boardXPos,
      building.boardYPos,
      building.corner,
      building.playerNum
    );
    const { listOfPlayers } = this.state;

    // Buckle up for this grossness
    // See https://stackoverflow.com/questions/37662708/react-updating-state-when-state-is-an-array-of-objects
    const updatedPlayer = new Player(build.playerNum);
    updatedPlayer.copyFromPlayer(listOfPlayers[build.playerNum - 1]);
    updatedPlayer.buildings.push(build);

    // Push copy to state
    this.setState({
      ...this.state,
      listOfPlayers: [
        ...listOfPlayers.slice(0, build.playerNum - 1),
        updatedPlayer,
        ...listOfPlayers.slice(build.playerNum),
      ],
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

    // Start off by joining the
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
      this.setState({
        ...this.state,
        isLoading: false,
        boardToBePlayed: {
          resources: game.resources,
          counters: game.counters,
          gameID: 1,
        },
      });
    }
  }

  // Callback function for the 'Dice' component
  hasRolled() {
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

      for (let y = -2; y <= 0; y++) {
        for (let x = 0; x < y + 5; x++) {
          cornerLoop: for (let corner = 0; corner < 6; corner++) {
            let adjX = y === -2 ? x - 1 : x - 2;
            // Second rows don't have a 0 x tile, so just substitute for the end tile
            if (Math.abs(y) === 1 && adjX === 0) {
              adjX = 2;
            }

            // If there is already a building in the spot, don't highlight it
            for (const pl of listOfPlayers) {
              for (const setl of pl.buildings) {
                if (
                  adjX === setl.boardXPos &&
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
                boardXPos={adjX}
                boardYPos={y}
                corner={corner}
                finishedSelectingCallback={callback}
                playerWhoSelected={inGamePlayerNum}
                typeOfHighlight={typeofHighlight}
              />
            );

            // Render opposite rows at the same time
            if (y !== 0) {
              spots.push(
                <HighlightPoint
                  key={keyForHighlights++}
                  boardXPos={adjX}
                  boardYPos={-y}
                  corner={corner}
                  finishedSelectingCallback={callback}
                  playerWhoSelected={inGamePlayerNum}
                  typeOfHighlight={typeofHighlight}
                />
              );
            }
          }
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
          <Board
            resources={boardToBePlayed.resources}
            counters={boardToBePlayed.counters}
          />
          {this.renderDice()}
          {this.generateAllPlayerCards()}
          {this.endTurnButton()}
          {this.highlightNeededSpaces()}
          {this.renderRoads()}
          {/* <Road boardXPos={0} boardYPos={0} hexEdge={5} /> */}
          {this.renderBuildings()}
          {/* <ResourceCard /> */}
          {/* <Settlement color="orange" corner={0} boardXPos={0} boardYPos={0} /> */}
        </svg>
      );
    }
  }
}
