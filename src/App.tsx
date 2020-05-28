import React from "react";
// import './App.css';
import { Board } from "./components/Board";
import test from "./tester.jpg";
import { Dice } from "./components/Dice";
import { PlayerCard } from "./components/PlayerCard";
import { FoAButton } from "./components/FoAButton";
import socketIOClient from "socket.io-client";
import HighlightPoint from "./components/HighlightPoint";

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
  numberOfPlayers: number;
  // Number 1-4 representing which 'player' is currently taking their turn
  currentPersonPlaying: number;
  canEndTurn: boolean;
  // Number 1-4 representing which player the client is
  inGamePlayerNum: number;
  hasRolled: boolean;
  isCurrentlyPlacingSettlement: boolean;
};

export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true,
      boardToBePlayed: {
        resources: [],
        counters: [],
        gameID: -1,
      },
      numberOfPlayers: -1,
      currentPersonPlaying: -1,
      canEndTurn: false,
      inGamePlayerNum: -1,
      hasRolled: false,
      isCurrentlyPlacingSettlement: true,
    };

    // Probably change to arrow functions to we don't have to do this
    this.endTurn = this.endTurn.bind(this);
    this.hasRolled = this.hasRolled.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.changeCurrentPlayer = this.changeCurrentPlayer.bind(this);
    this.joinedGame = this.joinedGame.bind(this);
    this.processBuildingUpdate = this.processBuildingUpdate.bind(this);
    this.processTurnUpdate = this.processTurnUpdate.bind(this);
    this.selectionCallBack = this.selectionCallBack.bind(this);
    this.evaluateEndTurnEligibility = this.evaluateEndTurnEligibility.bind(
      this
    );

    this.setupSockets();
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
  processTurnUpdate(nextPlayer: number) {
    this.setState({
      ...this.state,
      currentPersonPlaying: nextPlayer,
    });
  }

  // WIP
  processBuildingUpdate(building: {
    boardXPos: number;
    boardYPos: number;
    corner: number;
    playerNum: number;
  }) {
    console.log(building);
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
  }

  async componentDidMount() {
    // this.makeNewGame();
    await this.getBoardOne();
    // this.getGameInfo();
    // this.createNewPlayer();
    // window.addEventListener("beforeunload", this.removePlayer);
  }

  // componentWillUnmount() {
  //   window.removeEventListener("beforeunload", this.removePlayer);
  // }

  // async removePlayer() {
  //   const { playerID } = this.state;
  //   const { gameID } = this.state.boardToBePlayed;
  //   if (playerID !== -1) {
  //     return await fetch(
  //       `http://localhost:3001/removePlayerFromGame/${gameID}&${playerID}`
  //     )
  //       .then((res) => res.json)
  //       .then((resp) => console.log(resp));
  //   }
  // }

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
    const { hasRolled, isCurrentlyPlacingSettlement } = this.state;
    if (hasRolled && !isCurrentlyPlacingSettlement) {
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

  // TODO: Migrate this DB stuff to sockets
  // Gets the board with id '1' from the DB
  getBoardOne() {
    return fetch("http://localhost:3001/boards/1")
      .then((resp) => resp.json())
      .then((res) => {
        if (this.state.isLoading) {
          this.setState({
            ...this.state,
            isLoading: false,
            boardToBePlayed: { ...res },
          });
        }
        // this.changePlayerTurn();
        return res;
      });
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
          width={175}
          height={50}
        />
      );
    }
  }

  // Callback for when a player is done selecting where their settlement should go
  // TODO: Rename
  selectionCallBack() {
    console.log("Selected first settlement");
    this.setState(
      {
        isCurrentlyPlacingSettlement: false,
      },
      this.evaluateEndTurnEligibility
    );
  }

  // Highlights the available places to put settlements
  // TODO: Rename
  highlightAvailableSpace() {
    const {
      currentPersonPlaying,
      inGamePlayerNum,
      isCurrentlyPlacingSettlement,
    } = this.state;
    const isTurn = currentPersonPlaying === inGamePlayerNum;

    if (isTurn && isCurrentlyPlacingSettlement) {
      const spots = [];
      let keyForHighlights = 0;

      for (let y = -2; y <= 0; y++) {
        for (let x = 0; x < y + 5; x++) {
          for (let corner = 0; corner < 6; corner++) {
            let adjX = y === -2 ? x - 1 : x - 2;
            // Second rows don't have a 0 x tile, so just substitute for the end tile
            if (Math.abs(y) === 1 && adjX === 0) {
              adjX = 2;
            }

            spots.push(
              <HighlightPoint
                key={keyForHighlights++}
                boardXPos={adjX}
                boardYPos={y}
                corner={corner}
                finishedSelectingCallback={this.selectionCallBack}
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
                  finishedSelectingCallback={this.selectionCallBack}
                />
              );
            }
          }
        }
      }

      return spots;
    }
  }

  render() {
    const {
      isLoading,
      canEndTurn,
      inGamePlayerNum,
      currentPersonPlaying,
    } = this.state;

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
          <Dice
            hasRolled={this.state.hasRolled}
            isPlayersTurn={inGamePlayerNum === currentPersonPlaying}
            hasRolledCallBack={this.hasRolled}
            diceOneX={100}
            diceOneY={200}
          />
          <PlayerCard inGamePlayerNum={inGamePlayerNum} />
          {this.endTurnButton()}
          {this.highlightAvailableSpace()}
          {/* <ResourceCard /> */}
          {/* <Settlement color="orange" corner={0} boardXPos={0} boardYPos={0} /> */}
        </svg>
      );
    }
  }
}
