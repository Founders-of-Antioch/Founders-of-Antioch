import React from "react";
import { socket } from "../App";
import { widthOfSVG } from "./Board";
import { PlayerNumber, HasRolledAction, hasRolled } from "../Actions";
import { connect, ConnectedProps } from "react-redux";
import { FoAppState } from "../redux/reducers/reducers";
import { Dispatch } from "redux";

export type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6;

type UIState = {
  diceOneValue: DiceNumber;
  diceTwoValue: DiceNumber;
};

type DiceState = {
  hasRolled: boolean;
  currentPersonPlaying: PlayerNumber;
  inGamePlayerNumber: PlayerNumber;
};

function mapStateToProps(store: FoAppState): DiceState {
  return {
    hasRolled: store.hasRolled,
    currentPersonPlaying: store.currentPersonPlaying,
    inGamePlayerNumber: store.inGamePlayerNumber,
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    rolled: (didRoll: boolean): HasRolledAction => {
      return dispatch(hasRolled(didRoll));
    },
  };
}

const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type DiceProps = PropsFromRedux & {
  // Callback for when the dice have been rolled
  hasRolledCallBack: Function;
  // X and Y of the first die
  diceOneX: number;
  diceOneY: number;
};

export const diceLength = widthOfSVG / 20;

class Dice extends React.Component<DiceProps, UIState> {
  constructor(props: DiceProps) {
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
    // Listens for when other players roll the dice
    socket.on("diceUpdate", (d1: DiceNumber, d2: DiceNumber) => {
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
      const diceOne = Math.floor(Math.random() * 6) + 1;
      const diceTwo = Math.floor(Math.random() * 6) + 1;

      const possibleOutcomes: Array<DiceNumber> = [1, 2, 3, 4, 5, 6];

      this.setState({
        diceOneValue: possibleOutcomes[diceOne - 1],
        diceTwoValue: possibleOutcomes[diceTwo - 1],
      });

      // TODO: Fix to have actual gameID
      // Tells the backend what the player has rolled
      socket.emit("roll", diceOne, diceTwo, "1");

      this.props.rolled(true);
      // Tells the app state that the dice have been rolled
      this.props.hasRolledCallBack(diceOne + diceTwo);
    }
  }

  // This whole method is a pile of garbage. Because the dots on a dice order in a weird way depending on the number
  makeNumberCircles(op: number) {
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
            opacity={op}
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
    const {
      diceOneX,
      diceOneY,
      hasRolled,
      currentPersonPlaying,
      inGamePlayerNumber,
    } = this.props;
    const isPlayersTurn = currentPersonPlaying === inGamePlayerNumber;

    const shouldBeDisabled = hasRolled || !isPlayersTurn;
    // const shouldBeDisabled = hasRolled;
    const op = shouldBeDisabled ? 0.7 : 1.0;
    console.log(hasRolled);
    console.log(isPlayersTurn);

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
          opacity={op}
        />
        <rect
          width={diceLength}
          height={diceLength}
          x={diceOneX + diceLength * 1.125}
          y={diceOneY}
          rx={diceLength / 5}
          fill="#bf0704"
          opacity={op}
        />
        {/* <circle
          cx={diceLength / 2}
          cy={diceLength / 2}
          r={diceLength / 10}
          fill="#bf0704"
        /> */}
        {this.makeNumberCircles(op)}
      </g>
    );
  }
}

export default connector(Dice);
