import React from "react";
// import './App.css';
import { Board } from "./components/Board";
import test from "./tester.jpg";
import { Dice } from "./components/Dice";
import { PlayerCard } from "./components/PlayerCard";
import { FoAButton } from "./components/FoAButton";
import socketIOClient from "socket.io-client";
import { ResourceCard } from "./components/ResourceCard";
import { Settlement } from "./components/Settlement";
import HighlightPoint from "./components/HighlightPoint";

export const socket = socketIOClient.connect("http://localhost:3001");

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
    };

    this.endTurn = this.endTurn.bind(this);
    this.hasRolled = this.hasRolled.bind(this);
    this.endTurn = this.endTurn.bind(this);
    // this.socketE();
    this.socketer();
  }

  socketer() {
    socket.on("getWhoseTurnItIs", (playNum: number) => {
      this.setState({
        ...this.state,
        currentPersonPlaying: playNum,
      });
    });

    socket.emit("joinGame", "1");
    socket.emit("whoseTurnIsIt", "1");
    socket.on("joinedGame", (playerNum: number) => {
      if (this.state.inGamePlayerNum === -1) {
        this.setState({
          ...this.state,
          inGamePlayerNum: playerNum,
        });
      }
    });
    socket.on("turnUpdate", (nextPlayer: number) => {
      this.setState({
        ...this.state,
        currentPersonPlaying: nextPlayer,
      });
    });
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

  hasRolled() {
    this.setState({
      ...this.state,
      canEndTurn: true,
      hasRolled: true,
    });
  }

  // async endTurn() {
  //   const { currentPlayersTurn, numberOfPlayers } = this.state;
  //   const nextPlayer =
  //     currentPlayersTurn === numberOfPlayers ? 1 : currentPlayersTurn + 1;
  //   await this.changePlayerTurn(nextPlayer);
  //   this.setState({
  //     ...this.state,
  //     currentPlayersTurn: nextPlayer,
  //   });
  // }

  endTurn() {
    socket.emit("endTurn", String(this.state.boardToBePlayed.gameID));
    this.setState({
      ...this.state,
      canEndTurn: false,
      hasRolled: false,
    });
  }

  changePlayerTurn(playerNumber: number) {
    return fetch(
      `http://localhost:3001/newTurn/${this.state.boardToBePlayed.gameID}&${playerNumber}`,
      { method: "PUT" }
    )
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res);
      });
  }

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

  // makeNewGame() {
  //   return fetch("http://localhost:3001/games", { method: "POST" })
  //     .then((resp) => resp.json())
  //     .then((res) => {
  //       if (this.state.isLoading) {
  //         this.setState({
  //           ...this.state,
  //           isLoading: false,
  //           boardToBePlayed: { ...res },
  //         });
  //       }
  //       this.getGameInfo();

  //       return res;
  //     });
  // }

  // getGameInfo() {
  //   return fetch(
  //     `http://localhost:3001/games/${this.state.boardToBePlayed.gameID}`
  //   )
  //     .then((resp) => resp.json())
  //     .then((res) => {
  //       this.setState({
  //         ...this.state,
  //         numberOfPlayers: res.numberOfPlayers,
  //         currentPlayersTurn: res.currentPlayersTurn,
  //       });
  //     });
  // }

  // createNewPlayer() {
  //   return fetch(`http://localhost:3001/createNewPlayer/1`, { method: "POST" })
  //     .then((resp) => resp.json())
  //     .then((res) => {
  //       this.setState({
  //         ...this.state,
  //         playerID: res.id,
  //       });
  //     });
  // }

  endTurnButton() {
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

  render() {
    const {
      isLoading,
      canEndTurn,
      inGamePlayerNum,
      currentPersonPlaying,
    } = this.state;

    // If this isn't null, React breaks the CSS ¯\_(ツ)_/¯
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
          {/* <ResourceCard /> */}
          {/* <Settlement color="orange" corner={0} boardXPos={0} boardYPos={0} /> */}
        </svg>
      );
    }
  }
}
