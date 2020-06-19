import React from "react";
// import './App.css';
import Board, { widthOfSVG, heightOfSVG } from "./components/Board";
import test from "./tester.jpg";
import Dice, { diceLength } from "./components/Dice";
import PlayerCard, { playerCardWidth } from "./components/PlayerCard";
import { FoAButton } from "./components/FoAButton";
import socketIOClient from "socket.io-client";
import HighlightPoint from "./components/HighlightPoint";
import { Building } from "./entities/Building";
import { Settlement } from "./components/Settlement";
import Road from "./components/Road";
import { RoadModel } from "./entities/RoadModel";
import { LIST_OF_RESOURCES } from "./entities/Player";
import { ResourceCard } from "./components/GameCards/ResourceCard";
import { TileModel } from "./entities/TileModel";
import store from "./redux/store";
import { SeedState } from "./redux/reducers/reducers";
import "semantic-ui-css/semantic.min.css";
import { AppProps } from "./containter-components/VisibleApp";
import VisibleActionButtonSet from "./containter-components/VisibleActionButtonSet";
import TradeProposed from "./components/Trading/TradeProposed";
import { Port } from "./components/Port";
import DevelopmentCardBack from "./components/GameCards/DevelopmentCardBack";
import {
  DevCardCode,
  ResourceString,
  PlayerNumber,
} from "../../types/Primitives";
import {
  ResourceChangePackage,
  ProposedTradeSocketPackage,
} from "../../types/SocketPackages";

// const unsubscribe =
store.subscribe(() => console.log(store.getState()));

export const socket = socketIOClient.connect("http://localhost:3001");

type UIState = {
  isLoading: boolean;
  showTrades: boolean;
  trades: Array<ProposedTradeSocketPackage>;
};

let hasSeeded = false;

export default class App extends React.Component<AppProps, UIState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      isLoading: true,
      showTrades: false,
      trades: [],
    };

    // Probably change to arrow functions to we don't have to do this
    this.endTurn = this.endTurn.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.processBuildingUpdate = this.processBuildingUpdate.bind(this);
    this.processTurnUpdate = this.processTurnUpdate.bind(this);
    this.processGetGame = this.processGetGame.bind(this);
    this.renderRoads = this.renderRoads.bind(this);
    this.renderTrades = this.renderTrades.bind(this);
    this.closeTradeWindow = this.closeTradeWindow.bind(this);

    this.setupSockets();

    // TODO: Fix GameID
    socket.emit("needGame", "1");
  }

  componentDidMount() {
    // this.seed();
  }

  componentDidUpdate() {
    this.props.evaluateTurn();
  }

  closeTradeWindow(index: number) {
    const { trades } = this.state;

    this.setState({
      ...this.state,
      trades: [...trades.slice(0, index), ...trades.slice(index + 1)],
    });
  }

  renderTrades() {
    if (this.state.showTrades) {
      let trades = [];
      let key = 0;
      // TODO: Fix for multiple trades
      for (const currTrade of this.state.trades) {
        // Give/get are swapped because the trade is giving resources from
        // player x to y, but in the view of player y, it's getting
        // from player x
        trades.push(
          <TradeProposed
            key={key++}
            getResources={currTrade.playerGiveResources}
            giveResources={currTrade.playerGetResources}
            playerTrading={currTrade.playerNumber}
            tradeIndex={key - 1}
            closeWindowCB={this.closeTradeWindow}
          />
        );
      }

      return trades;
    } else {
      return null;
    }
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

    this.props.changePlayer(nextPlayer);
    this.props.nextTurn(incomingTurnNumber);
    this.props.isPlacingASettlement(
      inGamePlayerNumber === nextPlayer && incomingTurnNumber <= 2
    );

    this.forceUpdate();
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

    this.props.placeSettlement(build);
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
      this.props.changePlayer(pNum)
    );

    // Start off by joining the game, ID
    socket.emit("joinGame", "1");
    // This is essentially an API call, we ask whose turn it is and then it will send the result back up to ^
    // 'get whose turn it is' which processes the response
    socket.emit("whoseTurnIsIt", "1");

    // Backend sends an event once the player has joined
    socket.on("joinedGame", (inGamePNum: PlayerNumber) => {
      if (this.props.inGamePlayerNumber === -1) {
        this.props.declarePlayerNumber(inGamePNum);
      }
    });
    // Backend sends an event when the turn changes
    socket.on("turnUpdate", this.processTurnUpdate);
    // Backend sends an event when someone places a new building
    socket.on("buildingUpdate", this.processBuildingUpdate);
    // Backend sends an event when someone places a new road
    socket.on("roadUpdate", (r: RoadModel) => {
      this.props.placeRoad(r);
    });

    socket.on("giveGame", this.processGetGame);

    socket.emit("getSeedState", this.props.boardToBePlayed.listOfTiles);
    socket.on("sendSeed", (seedState: SeedState) => {
      // this.props.plantTheSeed(seedState);
    });

    socket.on("tradeProposed", (pkg: ProposedTradeSocketPackage) => {
      console.log(pkg);
      this.setState({
        showTrades: true,
        trades: [...this.state.trades, pkg],
      });
    });

    socket.on("resourceUpdate", (pkg: ResourceChangePackage) => {
      for (const res in pkg.resourceDeltaMap) {
        const amount = pkg.resourceDeltaMap[res];
        this.props.changeResource(
          pkg.playerNumber,
          res as ResourceString,
          amount
        );
      }
    });

    socket.on("tradeClose", (tIndex: number) => {
      this.closeTradeWindow(tIndex);
    });
  }

  processGetGame(game: {
    currentPersonPlaying: number;
    counters: Array<string>;
    resources: Array<ResourceString>;
    devCards: Array<DevCardCode>;
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
      this.props.declareBoard(tileList, "1");
    }
  }

  // Ends the players turn
  // Should only be used as callback for the end turn button
  // TODO: Move into endTurnButton
  endTurn() {
    socket.emit("endTurn", String(this.props.boardToBePlayed.gameID));
    this.props.hasRolledTheDice(false);
    this.props.possibleToEndTurn(false);
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
          canEndTurn={this.props.canEndTurn}
          // TODO: Change for dynamic size
          width={175}
          height={50}
        />
      );
    }
  }

  // Highlights the available places to put settlements
  // TODD: Move most of this into it's own component
  highlightSettlingSpaces(typeofHighlight: string) {
    // const { isCurrentlyPlacingRoad } = this.state;
    const {
      listOfPlayers,
      currentPersonPlaying,
      inGamePlayerNumber,
      isCurrentlyPlacingSettlement,
      isCurrentlyPlacingRoad,
    } = this.props;

    const isTurn = currentPersonPlaying === inGamePlayerNumber;
    const placing =
      typeofHighlight === "road"
        ? isCurrentlyPlacingRoad
        : isCurrentlyPlacingSettlement;

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
          diceOneX={(widthOfSVG * 4) / 5}
          diceOneY={heightOfSVG / 2 - diceLength / 2}
        />
      );
    }
  }

  highlightNeededSpaces() {
    // const { isCurrentlyPlacingRoad } = this.state;
    const { isCurrentlyPlacingSettlement, isCurrentlyPlacingRoad } = this.props;
    if (isCurrentlyPlacingRoad) {
      return this.highlightSettlingSpaces("road");
    } else if (isCurrentlyPlacingSettlement) {
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
            playerModel={getPlayer}
          />
        );
      } else {
        // TODO: Fix so it's CSS
        // Junk but equally distributes three cards across top
        let currX = (widthOfSVG - playerCardWidth) * (topX++ / 2);

        playerCards.push(
          <PlayerCard key={key++} bkgX={currX} playerModel={getPlayer} />
        );
      }
    }

    return playerCards;
  }

  generateResourceCards() {
    const { listOfPlayers, inGamePlayerNumber } = this.props;

    let key = 0;
    let resCardArr = [];

    for (const res of LIST_OF_RESOURCES) {
      let player = listOfPlayers.get(inGamePlayerNumber);

      if (player !== undefined) {
        let resAmount = player.getNumberOfResources(res);

        if (resAmount === undefined) {
          resAmount = -1;
        }

        resCardArr.push(
          <ResourceCard
            key={key++}
            resource={res}
            amount={resAmount}
            positionInHand={key - 1}
          />
        );
      } else {
        // If they're not part of the game
        return null;
      }
    }

    return resCardArr;
  }

  constructPorts() {
    // X, Y, Edge
    const portLocations = [
      [-1, -2, 2],
      [-2, -2, 3],
      [-2, -1, 4],
      [-1, 1, 4],
      [0, 2, 5],
      [1, 2, 0],
      [2, 1, 0],
      [2, 0, 1],
      [1, -1, 2],
    ];

    let portArr = [];
    let key = 0;

    for (const currLocation of portLocations) {
      const x = currLocation[0];
      const y = currLocation[1];
      const e = currLocation[2];

      portArr.push(
        <Port key={key++} boardXPos={x} boardYPos={y} hexEdge={e} />
      );
    }

    return portArr;
  }

  render() {
    const { isLoading } = this.state;

    // If this isn't null, React breaks the CSS ¯\_(ツ)_/¯
    // Should find a way to fix this/have a decent loading icon or screen
    if (isLoading) {
      return null;
    } else {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
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
              {this.endTurnButton()}
              {this.highlightNeededSpaces()}
              {this.renderRoads()}
              {this.renderBuildings()}
            </svg>
          </div>

          {this.generateAllPlayerCards()}

          <VisibleActionButtonSet />
          {/* <TradeProposed
            getResources={["wheat", "brick", "ore", "sheep", "wood"]}
            getAmounts={[1, 1, 1, 1, 1]}
            giveResources={["wheat", "brick", "ore", "sheep", "wood"]}
            giveAmounts={[1, 1, 1, 1, 1]}
          /> */}
          {this.renderTrades()}

          {/* {this.constructPorts()} */}
          {this.generateResourceCards()}
        </div>
      );
    }
  }
}
