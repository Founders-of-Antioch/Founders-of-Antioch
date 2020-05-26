import React from "react";
import { heightOfSVG, hexRadius, widthOfSVG } from "./Board";

export interface SettlementProps {
  color: string;
  // Like Robber coordinates
  boardXPos: number;
  boardYPos: number;
  // Corner 0 is top tip going clockwise until corner 5
  corner: number;
}

export class Settlement extends React.Component<SettlementProps, {}> {
  // Stollen from Robber comp
  centerTileX() {
    const { boardXPos, boardYPos } = this.props;

    // The first 'row' above the middle is shifted
    let adjustXPos = boardXPos;
    //If it is in the row above the middle and to the left of the center
    if (boardXPos < 0 && (boardYPos === -1 || boardYPos === 1)) {
      adjustXPos += 0.5;
    } else if ((boardYPos === -1 || boardYPos === 1) && boardXPos > 0) {
      //If it is in the row above the middle and to the right of the center
      adjustXPos -= 0.5;
    }

    return adjustXPos * Math.sqrt(3) * hexRadius + widthOfSVG / 2;
  }

  centerTileY() {
    const { boardYPos } = this.props;
    return heightOfSVG / 2 - boardYPos * 1.5 * hexRadius;
  }

  actualX() {
    let centX = this.centerTileX();
    const halfTile = (Math.sqrt(3) * hexRadius) / 2;
    const { corner } = this.props;

    if (corner > 0 && corner < 3) {
      return centX + halfTile;
    } else if (corner < 6 && corner > 3) {
      return centX - halfTile;
    } else {
      return centX;
    }
  }

  actualY() {
    let centY = this.centerTileY();
    const halfTile = (Math.sqrt(3) * hexRadius) / 2;
    const { corner } = this.props;

    if (corner === 1 || corner === 5) {
      return centY - hexRadius / 2;
    } else if (corner === 2 || corner === 4) {
      return centY + hexRadius / 2;
    } else if (corner == 0) {
      return centY - hexRadius;
    } else {
      return centY + hexRadius;
    }
  }

  render() {
    const settlementWidth = 30;
    const startX = this.actualX() - settlementWidth / 2;
    const startY = this.actualY() - settlementWidth / 2;

    return (
      <g>
        <rect
          x={startX}
          y={startY}
          width={settlementWidth}
          height={settlementWidth}
          fill={this.props.color}
          stroke="black"
          strokeWidth="3"
        />
        <polygon
          points={`${startX},${startY} ${startX + settlementWidth / 2},${
            startY - settlementWidth / 2
          } ${startX + settlementWidth},${startY}`}
          fill={this.props.color}
          stroke="black"
          strokeWidth="3"
        />
      </g>
    );
  }
}
