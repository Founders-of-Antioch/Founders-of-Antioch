import React from "react";
// import './App.css';
import { Board } from "./components/Board";
import test from "./tester.jpg";
import { Dice } from "./components/Dice";

function App() {
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
      <Board />
      <Dice diceOneX={100} diceOneY={100} />
    </svg>
  );
}

export default App;
