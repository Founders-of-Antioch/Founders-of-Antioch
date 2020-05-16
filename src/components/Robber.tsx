import React from "react";
import { widthOfSVG, heightOfSVG } from "./Board";

// Center tile is 0,0 - going right is pos and left neg, up pos and down neg, just like a standard XY coordinate system. E.g. top left tile is -1, 2
type RobberState = {
  boardXPos: number;
  boardYPos: number;
};

export class Robber extends React.Component<{}, RobberState> {
  constructor() {
    super({});
    this.state = {
      boardXPos: 0,
      boardYPos: 0,
    };
  }

  actualX() {
    const { boardXPos } = this.state;
    return boardXPos * 5 + widthOfSVG / 2;
  }

  actualY() {
    return heightOfSVG / 2;
  }

  render() {
    return (
      <circle fill="black" r="10" cx={this.actualX()} cy={this.actualY()} />
    );
  }
}
