import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShip } from "@fortawesome/free-solid-svg-icons";
import { centerTileX, centerTileY } from "./Settlement";
import { hexRadius } from "./Board";

type PortProps = {
  boardXPos: number;
  boardYPos: number;
  hexEdge: number;
};

export class Port extends React.Component<PortProps, {}> {
  getX() {
    const { boardXPos, boardYPos, hexEdge } = this.props;

    let x = centerTileX(boardXPos, boardYPos);

    if (hexEdge === 0 || hexEdge === 2) {
      x += (Math.sqrt(3) * hexRadius) / 4;
    } else if (hexEdge === 3 || hexEdge === 5) {
      x -= (Math.sqrt(3) * hexRadius) / 2;
    } else if (hexEdge === 1) {
      x += hexRadius;
    } else {
      x -= hexRadius + (Math.sqrt(3) * hexRadius) / 4;
    }

    return x;
  }

  getY() {
    const { boardYPos, hexEdge } = this.props;
    let y = centerTileY(boardYPos);

    if (hexEdge === 5 || hexEdge === 0) {
      y -= hexRadius;
    } else if (hexEdge === 2 || hexEdge === 3) {
      y += hexRadius * 0.75;
    }

    return y;
  }

  render() {
    return (
      <div
        style={{
          zIndex: 2,
          position: "absolute",
        }}
      >
        <FontAwesomeIcon
          color={"white"}
          size={"1x"}
          style={{
            marginLeft: `${this.getX()}px`,
            marginTop: `${this.getY()}px`,
          }}
          icon={faShip}
        />{" "}
      </div>
    );
  }
}
