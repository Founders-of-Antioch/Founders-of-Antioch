import React from "react";
// import './App.css';
import Board, { widthOfSVG, heightOfSVG } from "./components/Board";
import test from "./tester.jpg";
import Dice, { diceLength } from "./components/Dice";
import PlayerCard, {
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
import { Player, LIST_OF_RESOURCES } from "./entities/Player";
import { ResourceCard } from "./components/ResourceCard";
import { TileModel } from "./entities/TIleModel";
import {
  changePlayer,
  PlayerNumber,
  declarePlayerNumber,
  hasRolled,
  nextTurn,
  placeSettlement,
  placeRoad,
  ResourceString,
  declareBoard,
  activateRoadSelection,
  activateSettlementSelection,
} from "./redux/Actions";
import store from "./redux/store";
import { FoAppState, SeedState } from "./redux/reducers/reducers";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import "semantic-ui-css/semantic.min.css";
import ActionButtonSet from "./components/ActionButtonSet";

// const unsubscribe =
store.subscribe(() => console.log(store.getState()));

export const socket = socketIOClient.connect("http://localhost:3001");

type UIState = {
  isLoading: boolean;
  canEndTurn: boolean;
};

type AppState = {
  listOfPlayers: Map<PlayerNumber, Player>;
  inGamePlayerNumber: PlayerNumber;
  boardToBePlayed: { listOfTiles: Array<TileModel>; gameID: string };
  currentPersonPlaying: PlayerNumber;
  isSelectingRoad: boolean;
  isSelectingSettlement: boolean;
  turnNumber: number;
  hasRolled: boolean;
};

let hasSeeded = false;

function mapStateToProps(store: FoAppState): AppState {
  return {
    listOfPlayers: store.playersByID,
    inGamePlayerNumber: store.inGamePlayerNumber,
    boardToBePlayed: store.boardToBePlayed,
    currentPersonPlaying: store.currentPersonPlaying,
    isSelectingRoad: store.isSelectingRoad,
    isSelectingSettlement: store.isSelectingSettlement,
    turnNumber: store.turnNumber,
    hasRolled: store.hasRolled,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    placeASettlement: (build: Building) => {
      return dispatch(placeSettlement(build));
    },
    placeARoad: (road: RoadModel) => {
      return dispatch(placeRoad(road));
    },
    declareBoardState: (board: {
      listOfTiles: Array<TileModel>;
      gameID: string;
    }) => {
      return dispatch(declareBoard(board.listOfTiles, board.gameID));
    },
    declarePlayerN: (pNum: PlayerNumber) => {
      return dispatch(declarePlayerNumber(pNum));
    },
    // plantTheSeed: (s: SeedState) => {
    //   return dispatch(setSeed(s));
    // },
    activateRoadSelects: (s: boolean) => {
      return dispatch(activateRoadSelection(s));
    },
    activateSettlementSelects: (s: boolean) => {
      return dispatch(activateSettlementSelection(s));
    },
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type AppProps = ConnectedProps<typeof connector>;

class App extends React.Component<AppProps, UIState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      isLoading: true,
      canEndTurn: false,
    };

    this.props.activateSettlementSelects(true);
    this.props.activateRoadSelects(false);

    // Probably change to arrow functions to we don't have to do this
    this.endTurn = this.endTurn.bind(this);
    this.hasRolledCB = this.hasRolledCB.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.processBuildingUpdate = this.processBuildingUpdate.bind(this);
    this.processTurnUpdate = this.processTurnUpdate.bind(this);
    this.selectSettlementSpotCB = this.selectSettlementSpotCB.bind(this);
    this.selectRoadSpotCB = this.selectRoadSpotCB.bind(this);
    this.evaluateEndTurnEligibility = this.evaluateEndTurnEligibility.bind(
      this
    );
    this.processGetGame = this.processGetGame.bind(this);
    this.renderRoads = this.renderRoads.bind(this);

    this.setupSockets();

    // TODO: Fix GameID
    socket.emit("needGame", "1");
  }

  componentDidMount() {
    // this.seed();
  }

  // TODO: Move to backend
  seed() {
    if (!hasSeeded) {
      socket.emit("setSeedMode");

      // let players = [];
      // const pnums: Array<PlayerNumber> = [1, 2, 3, 4];
      // for (const pnum of pnums) {
      //   players.push(new Player(pnum));
      // }

      for (let i = 0; i < 4; i++) {
        socket.emit("joinGame", "1");
      }

      // x,y,corner,playnum
      const buildingSeed: Array<any> = [];
      //   new Building(0, 0, 0, 1),
      //   new Building(0, 0, 2, 1),
      //   new Building(1, 1, 2, 2),
      //   new Building(2, 0, 5, 2),
      //   new Building(-2, -2, 0, 3),
      //   new Building(-1, -1, 2, 3),
      //   new Building(0, 2, 2, 4),
      //   new Building(0, 0, 4, 4),

      for (const build of buildingSeed) {
        socket.emit(
          "addBuilding",
          "1",
          build.boardXPos,
          build.boardYPos,
          build.corner,
          build.playerNum
        );
      }

      // for (let i = 0; i < 8; i++) {
      //   // socket.emit("endTurn", String(this.state.boardToBePlayed.gameID));
      // }

      // // Fix with redux
      // this.setState({
      //   isCurrentlyPlacingSettlement: false,
      // });

      hasSeeded = true;
    }
  }

  // Callback for socket event, see "setupSockets"
  // Backend sockets will send turn updates, and this moves the state to the next player
  processTurnUpdate(nextPlayer: PlayerNumber, incomingTurnNumber: number) {
    const { inGamePlayerNumber } = this.props;

    //FIX
    store.dispatch(changePlayer(nextPlayer));
    store.dispatch(nextTurn(incomingTurnNumber));

    // Is true if it's still in the snake draft and it's the player's turn
    this.props.activateSettlementSelects(
      inGamePlayerNumber === nextPlayer && incomingTurnNumber <= 2
    );
  }

  processBuildingUpdate(building: {
    boardXPos: number;
    boardYPos: number;
    corner: number;
    playerNum: PlayerNumber;
  }) {
    const build = new Building(
      building.boardXPos,
      building.boardYPos,
      building.corner,
      building.playerNum,
      this.props.boardToBePlayed.listOfTiles
    );

    this.props.placeASettlement(build);
  }

  renderBuildings(): Array<any> {
    let buildingArr = [];
    let key = 0;

    for (const p of this.props.listOfPlayers.values()) {
      for (const i of p.buildings) {
        buildingArr.push(
          <Settlement
            key={key++}
            boardXPos={i.boardXPos}
            boardYPos={i.boardYPos}
            // TODO: Fix garbage
            playerNum={i.playerNum}
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
    socket.on("getWhoseTurnItIs", (pNum: PlayerNumber) =>
      store.dispatch(changePlayer(pNum))
    );

    // Start off by joining the game, ID
    socket.emit("joinGame", "1");
    // This is essentially an API call, we ask whose turn it is and then it will send the result back up to ^
    // 'get whose turn it is' which processes the response
    socket.emit("whoseTurnIsIt", "1");

    // Backend sends an event once the player has joined
    socket.on("joinedGame", (inGamePNum: PlayerNumber) => {
      if (this.props.inGamePlayerNumber === -1) {
        this.props.declarePlayerN(inGamePNum);
      }
    });
    // Backend sends an event when the turn changes
    socket.on("turnUpdate", this.processTurnUpdate);
    // Backend sends an event when someone places a new building
    socket.on("buildingUpdate", this.processBuildingUpdate);
    // Backend sends an event when someone places a new road
    socket.on("roadUpdate", (r: RoadModel) => {
      this.props.placeARoad(r);
    });

    socket.on("giveGame", this.processGetGame);

    // socket.emit("getSeedState", this.props.boardToBePlayed.listOfTiles);
    socket.on("sendSeed", (seedState: SeedState) => {
      // this.props.plantTheSeed(seedState);
    });
  }

  processGetGame(game: {
    currentPersonPlaying: number;
    counters: Array<string>;
    resources: Array<ResourceString>;
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
      });
      this.props.declareBoardState({ listOfTiles: tileList, gameID: "1" });
    }
  }

  // Callback function for the 'Dice' component
  // TODO: Move into Dice component once Redux migration is mature enough
  hasRolledCB() {
    this.evaluateEndTurnEligibility();
  }

  // Determines if the player can end their turn or not
  evaluateEndTurnEligibility() {
    const {
      isSelectingSettlement,
      isSelectingRoad,
      hasRolled,
      turnNumber,
    } = this.props;

    console.log(hasRolled);
    console.log(turnNumber);
    console.log(isSelectingSettlement);
    console.log(isSelectingRoad);
    if (
      (hasRolled || turnNumber <= 2) &&
      !isSelectingSettlement &&
      !isSelectingRoad
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
    socket.emit("endTurn", String(this.props.boardToBePlayed.gameID));
    store.dispatch(hasRolled(false));
    this.setState({
      ...this.state,
      canEndTurn: false,
    });
  }

  // Returns the end turn button component
  // TODO: Make this MaterialUI or SemanticUI component with foreignObj or something
  endTurnButton() {
    const { currentPersonPlaying, inGamePlayerNumber } = this.props;
    // Only render the button if it is the player's turn
    // You can only end your turn if it IS your turn
    if (currentPersonPlaying === inGamePlayerNumber) {
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
    this.props.activateSettlementSelects(false);
    this.props.activateRoadSelects(this.props.turnNumber <= 2);
    this.evaluateEndTurnEligibility();
  }

  // Callback for when a player is done selecting where the road should go
  selectRoadSpotCB() {
    console.log("HERE");
    this.props.activateRoadSelects(false);
    console.log("HERE1");

    // WHY
    // For SOME reason, redux store doesn't update fast enough and if this doesn't wait, it doesn't work
    var millisecondsToWait = 1000;
    setTimeout(() => {
      // Whatever you want to do after the wait
      this.evaluateEndTurnEligibility();
    }, millisecondsToWait);
  }

  // Highlights the available places to put settlements
  // TODD: Move most of this into it's own component
  highlightSettlingSpaces(typeofHighlight: string) {
    const { isSelectingRoad, isSelectingSettlement } = this.props;
    const {
      listOfPlayers,
      currentPersonPlaying,
      inGamePlayerNumber,
    } = this.props;

    const isTurn = currentPersonPlaying === inGamePlayerNumber;
    const placing =
      typeofHighlight === "road" ? isSelectingRoad : isSelectingSettlement;
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
            for (const pl of listOfPlayers.values()) {
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
                playerWhoSelected={inGamePlayerNumber}
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
    // Only render the dice if we're done with initial placements
    if (this.props.turnNumber > 2) {
      return (
        <Dice
          hasRolledCallBack={this.hasRolledCB}
          diceOneX={(widthOfSVG * 4) / 5}
          diceOneY={heightOfSVG / 2 - diceLength / 2}
        />
      );
    }
  }

  highlightNeededSpaces() {
    const { isSelectingSettlement, isSelectingRoad } = this.props;
    if (isSelectingRoad) {
      return this.highlightSettlingSpaces("road");
    } else if (isSelectingSettlement) {
      return this.highlightSettlingSpaces("settlement");
    }
  }

  renderRoads() {
    const { listOfPlayers } = this.props;
    let roadArr = [];
    let key = 0;

    for (const p of listOfPlayers.values()) {
      for (const r of p.roads) {
        roadArr.push(<Road key={key++} model={r} />);
      }
    }

    return roadArr;
  }

  generateAllPlayerCards() {
    const { listOfPlayers, inGamePlayerNumber } = this.props;

    let playerCards = [];
    let key = 0;
    let topX = 0;

    for (let x = 0; x < 4; x++) {
      const getPlayer = listOfPlayers.get((key + 1) as PlayerNumber);
      if (!getPlayer) {
        // Shouldn't be possible
        console.log("Something went horribly wrong!");
        return;
      }

      if (x === inGamePlayerNumber - 1) {
        playerCards.push(
          <PlayerCard
            key={key++}
            bkgX={widthOfSVG / 2 - playerCardWidth / 2}
            bkgY={heightOfSVG - playerCardHeight}
            playerModel={getPlayer}
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
            playerModel={getPlayer}
          />
        );
      }
    }

    return playerCards;
  }

  generateResourceCards() {
    const { listOfPlayers, inGamePlayerNumber } = this.props;

    let key = 0;

    const cardWidth = widthOfSVG / 15;
    const cardHeight = (cardWidth * 4) / 3;
    let cardX = widthOfSVG * 0.01;
    const cardY = heightOfSVG - cardHeight;

    let resCardArr = [];
    for (const res of LIST_OF_RESOURCES) {
      let resAmount = listOfPlayers
        .get(inGamePlayerNumber)
        ?.getNumberOfResources(res);

      if (resAmount === undefined) {
        resAmount = -1;
      }

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
      return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              zIndex: 1,
            }}
          >
            <svg style={{ width: "100%", height: "100%" }}>
              {/* <rect width="100%" height="100%" fill="#00a6e4"></rect> */}
              <image
                href={test}
                x="0"
                y="0"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
              />
              <Board />
              {this.renderDice()}
              {this.generateAllPlayerCards()}
              {this.endTurnButton()}
              {this.highlightNeededSpaces()}
              {this.renderRoads()}
              {this.renderBuildings()}
              {this.generateResourceCards()}
            </svg>
          </div>

          <ActionButtonSet />
        </div>
      );
    }
  }
}

export default connector(App);
