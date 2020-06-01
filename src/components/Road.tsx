import React, { Component } from "react";
import { hexRadius } from "./Board";
import { centerTileX, centerTileY } from "./Settlement";

type RoadProps = {
  boardXPos: number;
  boardYPos: number;
  hexEdge: number;
};

export default class Road extends Component<RoadProps, {}> {
  render() {
    const { boardXPos, boardYPos, hexEdge } = this.props;

    let adjX = centerTileX(boardXPos, boardYPos);
    let adjY = centerTileY(boardYPos) - hexRadius / 2;

    if (hexEdge < 3) {
      adjX += (hexRadius * Math.sqrt(3)) / 2;
    } else {
      adjX -= (hexRadius * Math.sqrt(3)) / 2;
    }

    let rotateX = adjX;
    let rotateY = adjY;

    let rotation = 0;
    if (hexEdge === 0 || hexEdge === 3) {
      rotation = 120;
    } else if (hexEdge === 5 || hexEdge === 2) {
      rotation = -120;
    }

    if (hexEdge === 2 || hexEdge === 3) {
      rotateY += hexRadius;
    }

    // TODO: Should be same width as stroke in 'Tile' component
    // Or a little wider (?)
    const width = 10;

    return (
      <g>
        <rect
          x={adjX - width / 2}
          y={adjY}
          width={width}
          height={hexRadius}
          fill={"white"}
          stroke="black"
          strokeWidth="2"
          transform={`rotate(${rotation},${rotateX}, ${rotateY})`}
        />
        {/* <circle
          cx={rotateX}
          cy={rotateY}
          r={10}
          fill={"none"}
          stroke="black"
          strokeWidth={3}
        /> */}
      </g>
    );
  }
}
