import React from "react";
import { widthOfSVG, heightOfSVG, hexRadius } from "./Board";

// Center tile is 0,0 - going right is pos and left neg, up pos and down neg, just like a standard XY coordinate system. E.g. top left tile is -1, 2
type RobberState = {
  boardXPos: number;
  boardYPos: number;
};

export class Robber extends React.Component<{}, RobberState> {
  constructor() {
    super({});
    this.state = {
      boardXPos: -2,
      boardYPos: 0,
    };
  }

  actualX() {
    const { boardXPos, boardYPos } = this.state;

    // The first 'row' above the middle is shifted
    let adjustXPos = boardXPos;
    if (boardYPos === 1 && boardXPos < 0) {
      adjustXPos += 0.5;
    } else if (boardYPos === -1 && boardXPos > 0) {
      adjustXPos -= 0.5;
    }

    return adjustXPos * Math.sqrt(3) * hexRadius + widthOfSVG / 2;
  }

  actualY() {
    const { boardYPos } = this.state;
    return heightOfSVG / 2 - boardYPos * 1.5 * hexRadius;
  }

  render() {
    return (
      <circle fill="steelblue" r="30" cx={this.actualX()} cy={this.actualY()} />
    );
  }
}
