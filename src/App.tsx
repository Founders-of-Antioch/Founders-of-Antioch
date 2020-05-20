import React from "react";
// import './App.css';
import { Board } from "./components/Board";
import test from "./tester.jpg";
import { Dice } from "./components/Dice";

type AppState = {
  isLoading: boolean;
  gameToBePlayed: { resources: Array<string>; counters: Array<string> };
};

export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true,
      gameToBePlayed: {
        resources: [],
        counters: [],
      },
    };
    this.makeNewGame();
  }

  makeNewGame() {
    return fetch("http://localhost:3001/games", { method: "POST" })
      .then((resp) => resp.json())
      .then((res) => {
        if (this.state.isLoading) {
          this.setState({
            isLoading: false,
            gameToBePlayed: res,
          });
        }
        return res;
      });
  }

  render() {
    const { isLoading } = this.state;

    // If this isn't null, React breaks the CSS ¯\_(ツ)_/¯
    if (isLoading) {
      return null;
    } else {
      const { gameToBePlayed } = this.state;
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
            resources={gameToBePlayed.resources}
            counters={gameToBePlayed.counters}
          />
          <Dice diceOneX={100} diceOneY={100} />
        </svg>
      );
    }
  }
}
