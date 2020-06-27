import React from "react";
import { heightOfSVG, hexRadius, widthOfSVG } from "./Board";
import { PLAYER_COLORS } from "../colors";
import { PlayerNumber } from "../../../types/Primitives";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

export interface SettlementProps {
  playerNum: PlayerNumber;
  // Like Robber coordinates
  boardXPos: number;
  boardYPos: number;
  // Corner 0 is top tip going clockwise until corner 5
  corner: number;
}

// Stolen from Robber comp
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
    const { boardXPos, boardYPos, corner, playerNum } = this.props;

    const startX = xValofCorner(boardXPos, boardYPos, corner);
    const startY = yValofCorner(boardYPos, corner);

    // TODO: make stroke/style dynamic
    return (
      <div
        style={{
          // TODO: Change (widthsvg/115) to half of the width of the icon
          marginLeft: startX - widthOfSVG / 115,
          marginTop: startY - heightOfSVG / 2,
          zIndex: 2,
          position: "absolute",
        }}
      >
        <FontAwesomeIcon
          icon={faHome}
          style={{ stroke: "black", strokeWidth: 30 }}
          size="2x"
          color={PLAYER_COLORS.get(playerNum)}
        />
      </div>
    );
  }
}
