import React, { Component } from "react";
import { WHITE } from "../colors";
import { xValofCorner, yValofCorner } from "./Settlement";
import { widthOfSVG } from "./Board";

type Props = {
  boardXPos: number;
  boardYPos: number;
  corner: number;
};

export default class HighlightPoint extends Component<Props, {}> {
  render() {
    const { boardXPos, boardYPos, corner } = this.props;
    console.log(widthOfSVG);
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
        onClick={() => {
          console.log(123);
        }}
      />
    );
  }
}
