import React from "react";
import socketIOClient from "socket.io-client";
import { socket } from "../App";

type DiceState = {
  diceOneValue: number;
  diceTwoValue: number;
  hasRolled: boolean;
  // currentPlayersTurn: number;
};

type DiceProps = {
  hasRolledCallBack: Function;
  diceOneX: number;
  diceOneY: number;
};

const widthOfSVG = Number(document.getElementById("root")?.offsetWidth);
// const heightOfSVG = Number(document.getElementById("root")?.offsetHeight);
const diceLength = widthOfSVG / 20;

export class Dice extends React.Component<DiceProps, DiceState> {
  constructor(props: DiceProps) {
    super(props);
    this.state = {
      diceOneValue: 1,
      diceTwoValue: 1,
      hasRolled: false,
    };
    this.roll = this.roll.bind(this);
    this.setupSockets();
  }

  setupSockets() {
    console.log(45);
    socket.on("diceUpdate", (d1: number, d2: number) => {
      this.setState({
        ...this.state,
        diceOneValue: d1,
        diceTwoValue: d2,
      });
    });
  }

  roll() {
    if (!this.state.hasRolled) {
      const diceOne = Math.floor(Math.random() * 6) + 1;
      const diceTwo = Math.floor(Math.random() * 6) + 1;

      this.setState({
        diceOneValue: diceOne,
        diceTwoValue: diceTwo,
        hasRolled: true,
      });

      // TODO: Fix to have actual gameID
      socket.emit("roll", diceOne, diceTwo, "1");
    }
    this.props.hasRolledCallBack();
  }

  // This whole method is a pile of garbage. Because the dots on a dice order in a weird way depending on the number
  makeNumberCircles() {
    const { diceOneValue, diceTwoValue } = this.state;
    const { diceOneX, diceOneY } = this.props;

    let dotArr = [];
    let key = 0;

    // Draws all nine dots on each die and then just filters out the unneeded ones at the end
    for (let die = 0; die < 2; die++) {
      for (let i = 0; i < 9; i++) {
        const limitedI = i > 5 ? i - 6 : i > 2 ? i - 3 : i;
        let currX = diceOneX + (limitedI * diceLength) / 4 + diceLength / 4;
        let currY =
          diceOneY + (Math.floor(i / 3) * diceLength) / 4 + diceLength / 4;

        if (die === 1) {
          currX += diceLength * 1.125;
        }

        dotArr.push(
          <circle
            key={key++}
            onClick={this.roll}
            r={diceLength / 10}
            fill={die === 0 ? "#bf0704" : "#efd601"}
            cx={currX}
            cy={currY}
          />
        );
      }
    }
    const dotsToPreserve = [
      [],
      [4],
      [2, 6],
      [2, 4, 6],
      [0, 2, 6, 8],
      [0, 2, 4, 6, 8],
      [0, 2, 3, 5, 6, 8],
    ];

    const chosenOneDots = dotsToPreserve[diceOneValue];
    const chosenTwoDots = dotsToPreserve[diceTwoValue];

    return dotArr.filter((el, idx) => {
      for (let j = 0; j < chosenOneDots.length; j++) {
        if (chosenOneDots[j] === idx) {
          return true;
        }
      }

      for (let k = 0; k < chosenTwoDots.length; k++) {
        if (chosenTwoDots[k] + 9 === idx) {
          return true;
        }
      }

      return false;
    });
  }

  render() {
    // let normd: { [key: number]: number } = {};
    // for (let i = 0; i < 100000; i++) {
    //   const randDistr = Math.floor(Math.random() * 6) + 1;
    //   const randDT = Math.floor(Math.random() * 6) + 1;
    //   const sum = randDistr + randDT;
    //   if (sum in normd) {
    //     normd[sum] += 1;
    //   } else {
    //     normd[sum] = 1;
    //   }
    // }
    // console.log(normd);
    const { diceOneX, diceOneY } = this.props;

    return (
      <g>
        <rect
          onClick={this.roll}
          width={diceLength}
          height={diceLength}
          x={diceOneX}
          y={diceOneY}
          rx={diceLength / 5}
          fill="#efd601"
        />
        <rect
          onClick={this.roll}
          width={diceLength}
          height={diceLength}
          x={diceOneX + diceLength * 1.125}
          y={diceOneY}
          rx={diceLength / 5}
          fill="#bf0704"
        />
        {/* <circle
          cx={diceLength / 2}
          cy={diceLength / 2}
          r={diceLength / 10}
          fill="#bf0704"
        /> */}
        {this.makeNumberCircles()}
      </g>
    );
  }
}
