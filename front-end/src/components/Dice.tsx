import React from "react";
import { socket } from "../App";
import { widthOfSVG, heightOfSVG } from "./Board";
import {
  hasRolledTheDice,
  collectResources,
  evaluateTurn,
  playerIsPlacingRobber,
} from "../redux/Actions";
import { connect, ConnectedProps } from "react-redux";
import { FoAppState } from "../redux/reducers/reducers";
import { Dispatch, bindActionCreators } from "redux";
import { PlayerNumber } from "../../../types/Primitives";

export type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6;

type UIState = {
  diceOneValue: DiceNumber;
  diceTwoValue: DiceNumber;
};

type DiceState = {
  hasRolled: boolean;
  currentPersonPlaying: PlayerNumber;
  inGamePlayerNumber: PlayerNumber;
  turnNumber: number;
};

function mapStateToProps(store: FoAppState): DiceState {
  return {
    hasRolled: store.hasRolled,
    currentPersonPlaying: store.currentPersonPlaying,
    inGamePlayerNumber: store.inGamePlayerNumber,
    turnNumber: store.turnNumber,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    { hasRolledTheDice, collectResources, evaluateTurn, playerIsPlacingRobber },
    dispatch
  );
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const diceLength = widthOfSVG / 20;

// TOOD: Change to maybe something out of svg with SUI
const diceOneX = (widthOfSVG * 4) / 5;
const diceOneY = heightOfSVG / 2 - diceLength / 2;

class Dice extends React.Component<PropsFromRedux, UIState> {
  constructor(props: PropsFromRedux) {
    super(props);
    // TODO: should be fixed to whatever the current backend state is. GH issue open for this
    this.state = {
      diceOneValue: 1,
      diceTwoValue: 1,
    };
    this.roll = this.roll.bind(this);
    this.setupSockets = this.setupSockets.bind(this);
    this.setupSockets();
  }

  setupSockets() {
    // Listens for when players roll the dice
    socket.on("diceUpdate", (d1: DiceNumber, d2: DiceNumber) => {
      console.log("caught");
      // Once the backend tells all the players what someone rolled, then
      // give the appropriate resources
      this.props.collectResources(d1 + d2);
      this.setState({
        ...this.state,
        diceOneValue: d1,
        diceTwoValue: d2,
      });
    });
  }

  roll() {
    const { hasRolled } = this.props;
    // Don't let the player roll more than once
    if (!hasRolled) {
      this.props.hasRolledTheDice(true);

      const diceOne = Math.floor(Math.random() * 6) + 1;
      const diceTwo = Math.floor(Math.random() * 6) + 1;

      // TODO: Fix to have actual gameID
      // Tells the backend what the player has rolled
      socket.emit("roll", diceOne, diceTwo, "1");

      this.props.evaluateTurn();

      if (diceOne + diceTwo === 7) {
        this.props.playerIsPlacingRobber(true);
      }
    }
  }

  // This whole method is a pile of garbage. Because the dots on a dice order in a weird way depending on the number
  makeNumberCircles(dotOpacity: number) {
    const { diceOneValue, diceTwoValue } = this.state;

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
            opacity={dotOpacity}
            onClick={this.roll}
            r={diceLength / 10}
            fill={die === 0 ? "#bf0704" : "#efd601"}
            cx={currX}
            cy={currY}
          />
        );
      }
    }

    // Assume a 3x3 grid of dots, these are the ones to preserve for each index
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
    const { hasRolled, currentPersonPlaying, inGamePlayerNumber } = this.props;
    const isPlayersTurn = currentPersonPlaying === inGamePlayerNumber;

    const shouldBeDisabled = hasRolled || !isPlayersTurn;
    const diceOpacity = shouldBeDisabled ? 0.7 : 1.0;

    if (this.props.turnNumber > 2) {
      return (
        <g
          cursor={shouldBeDisabled ? "default" : "pointer"}
          onClick={shouldBeDisabled ? () => {} : this.roll}
        >
          <rect
            width={diceLength}
            height={diceLength}
            x={diceOneX}
            y={diceOneY}
            rx={diceLength / 5}
            fill="#efd601"
            opacity={diceOpacity}
          />
          <rect
            width={diceLength}
            height={diceLength}
            x={diceOneX + diceLength * 1.125}
            y={diceOneY}
            rx={diceLength / 5}
            fill="#bf0704"
            opacity={diceOpacity}
          />
          {/* <circle
          cx={diceLength / 2}
          cy={diceLength / 2}
          r={diceLength / 10}
          fill="#bf0704"
        /> */}
          {this.makeNumberCircles(diceOpacity)}
        </g>
      );
    } else {
      return null;
    }
  }
}

export default connector(Dice);
