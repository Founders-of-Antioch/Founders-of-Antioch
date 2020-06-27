import React, { Component } from "react";
import { hexRadius } from "./Board";
import { centerTileX, centerTileY } from "./Settlement";
import { PLAYER_COLORS } from "../colors";
import { RoadModel } from "../entities/RoadModel";

type RoadProps = {
  model: RoadModel;
};

export default class Road extends Component<RoadProps, {}> {
  render() {
    const { boardXPos, boardYPos, hexEdgeNumber, playerNum } = this.props.model;

    let adjX = centerTileX(boardXPos, boardYPos);
    let adjY = centerTileY(boardYPos) - hexRadius / 2;

    if (hexEdgeNumber < 3) {
      adjX += (hexRadius * Math.sqrt(3)) / 2;
    } else {
      adjX -= (hexRadius * Math.sqrt(3)) / 2;
    }

    let rotateX = adjX;
    let rotateY = adjY;

    let rotation = 0;
    if (hexEdgeNumber === 0 || hexEdgeNumber === 3) {
      rotation = 120;
    } else if (hexEdgeNumber === 5 || hexEdgeNumber === 2) {
      rotation = -120;
    }

    if (hexEdgeNumber === 2 || hexEdgeNumber === 3) {
      rotateY += hexRadius;
    }

    // TODO: Should be same width as stroke in 'Tile' component
    // TODO: Should be dynamic
    // Or a little wider (?)
    const width = 10;

    return (
      <g>
        <rect
          id={`${boardXPos}-${boardYPos}-${hexEdgeNumber}`}
          // Put it in the middle of the two tiles
          x={adjX - width / 2}
          y={adjY}
          width={width}
          height={hexRadius}
          fill={PLAYER_COLORS.get(playerNum)}
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
