import React from "react";
import { heightOfSVG, hexRadius, widthOfSVG } from "./Board";
import { PlayerNumber } from "../Actions";
import { PLAYER_COLORS } from "../colors";

export interface SettlementProps {
  playerNum: PlayerNumber;
  // Like Robber coordinates
  boardXPos: number;
  boardYPos: number;
  // Corner 0 is top tip going clockwise until corner 5
  corner: number;
}

// Stolen from Robber comp
// TODO: Adjust function in robber component to just use this
export function centerTileX(boardXPos: number, boardYPos: number) {
  let adjustXPos = boardXPos;

  adjustXPos -= 0.5 * boardYPos;

  return adjustXPos * Math.sqrt(3) * hexRadius + widthOfSVG / 2;
}

export function centerTileY(boardYPos: number) {
  return heightOfSVG / 2 - boardYPos * 1.5 * hexRadius;
}

// Gets the x value of a corner given a tile and a corner (0-5 starting at the tip and going clockwise)
export function xValofCorner(
  boardXPos: number,
  boardYPos: number,
  corner: number
) {
  let centX = centerTileX(boardXPos, boardYPos);
  const halfTile = (Math.sqrt(3) * hexRadius) / 2;

  if (corner > 0 && corner < 3) {
    return centX + halfTile;
  } else if (corner < 6 && corner > 3) {
    return centX - halfTile;
  } else {
    return centX;
  }
}

// Gets the y value of a corner given a tile and a corner (0-5 starting at the tip and going clockwise)
export function yValofCorner(boardYPos: number, corner: number) {
  let centY = centerTileY(boardYPos);

  if (corner === 1 || corner === 5) {
    return centY - hexRadius / 2;
  } else if (corner === 2 || corner === 4) {
    return centY + hexRadius / 2;
  } else if (corner === 0) {
    return centY - hexRadius;
  } else {
    return centY + hexRadius;
  }
}

export class Settlement extends React.Component<SettlementProps, {}> {
  render() {
    const { boardXPos, boardYPos, corner } = this.props;

    // TODO: Change to be dynamic
    const settlementWidth = 22.5;
    const startX =
      xValofCorner(boardXPos, boardYPos, corner) - settlementWidth / 2;
    const startY = yValofCorner(boardYPos, corner) - settlementWidth / 2;

    // TODO: Dynamic
    const stroke = 2;

    return (
      <g>
        <rect
          x={startX}
          y={startY}
          width={settlementWidth}
          height={settlementWidth}
          fill={PLAYER_COLORS.get(this.props.playerNum)}
          stroke="black"
          strokeWidth={stroke}
        />
        <polygon
          points={`${startX},${startY} ${startX + settlementWidth / 2},${
            startY - settlementWidth / 2
          } ${startX + settlementWidth},${startY}`}
          fill={PLAYER_COLORS.get(this.props.playerNum)}
          stroke="black"
          strokeWidth={stroke}
        />
      </g>
    );
  }
}
