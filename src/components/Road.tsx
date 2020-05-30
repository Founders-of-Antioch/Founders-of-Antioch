import React, { Component } from "react";
import { hexRadius } from "./Board";
import { centerTileX, centerTileY } from "./Settlement";

export default class Road extends Component {
  render() {
    return (
      <rect
        x={centerTileX(0, 0) - 5}
        y={centerTileY(0) - hexRadius * 2}
        // TODO: Should be same width as stroke in 'Tile' component
        // Or a little wider (?)
        width={10}
        height={hexRadius}
        fill={"white"}
        stroke="black"
        strokeWidth="2"
      />
    );
  }
}
