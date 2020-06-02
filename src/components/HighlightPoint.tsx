import React, { Component } from "react";
import { WHITE } from "../colors";
import { xValofCorner, yValofCorner } from "./Settlement";
import { widthOfSVG } from "./Board";
import { socket } from "../App";

// Highlights a point where a player can build a settlement

type Props = {
  boardXPos: number;
  boardYPos: number;
  corner: number;
  finishedSelectingCallback: Function;
  playerWhoSelected: number;
};

export default class HighlightPoint extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.selectedASpot = this.selectedASpot.bind(this);
  }

  // TODO: Replace with actual gameID
  selectedASpot(): void {
    const { boardXPos, boardYPos, corner, playerWhoSelected } = this.props;
    // Emit change for broadcast
    socket.emit(
      "addBuilding",
      "1",
      boardXPos,
      boardYPos,
      corner,
      playerWhoSelected
    );
    this.props.finishedSelectingCallback();
  }

  render() {
    const { boardXPos, boardYPos, corner } = this.props;
    return (
      <circle
        cx={xValofCorner(boardXPos, boardYPos, corner)}
        cy={yValofCorner(boardYPos, corner)}
        r={widthOfSVG / 100}
        stroke={WHITE}
        strokeWidth={2}
        cursor="pointer"
        fill="white"
        fillOpacity={0.25}
        onClick={this.selectedASpot}
      />
    );
  }
}
