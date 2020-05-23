import React from "react";
// import './App.css';
import { Board } from "./components/Board";
import test from "./tester.jpg";
import { Dice } from "./components/Dice";
import { PlayerCard } from "./components/PlayerCard";
import { FoAButton } from "./components/FoAButton";

type AppState = {
  isLoading: boolean;
  boardToBePlayed: {
    resources: Array<string>;
    counters: Array<string>;
    gameID: number;
  };
  numberOfPlayers: number;
  currentPlayersTurn: number;
  canEndTurn: boolean;
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
      currentPlayersTurn: -1,
      canEndTurn: false,
    };

    this.endTurn = this.endTurn.bind(this);
    this.hasRolled = this.hasRolled.bind(this);
  }

  componentDidMount() {
    // this.makeNewGame();
    this.getBoardOne();
  }

  hasRolled() {
    this.setState({
      ...this.state,
      canEndTurn: true,
    });
  }

  async endTurn() {
    const { currentPlayersTurn, numberOfPlayers } = this.state;
    const nextPlayer =
      currentPlayersTurn === numberOfPlayers ? 1 : currentPlayersTurn + 1;
    await this.changePlayerTurn(nextPlayer);
    this.setState({
      ...this.state,
      currentPlayersTurn: nextPlayer,
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
        this.getGameInfo();
        // this.changePlayerTurn();
        return res;
      });
  }

  makeNewGame() {
    return fetch("http://localhost:3001/games", { method: "POST" })
      .then((resp) => resp.json())
      .then((res) => {
        if (this.state.isLoading) {
          this.setState({
            ...this.state,
            isLoading: false,
            boardToBePlayed: { ...res },
          });
        }
        this.getGameInfo();

        return res;
      });
  }

  getGameInfo() {
    return fetch(
      `http://localhost:3001/games/${this.state.boardToBePlayed.gameID}`
    )
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({
          ...this.state,
          numberOfPlayers: res.numberOfPlayers,
          currentPlayersTurn: res.currentPlayersTurn,
        });
      });
  }

  render() {
    const { isLoading, canEndTurn } = this.state;

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
            hasRolledCallBack={this.hasRolled}
            diceOneX={100}
            diceOneY={200}
          />
          <PlayerCard />
          <FoAButton canEndTurn={canEndTurn} width={100} height={100} />
        </svg>
      );
    }
  }
}
