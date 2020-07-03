import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { xValofCorner, yValofCorner } from "./Settlement";
import { heightOfSVG } from "./Board";
import { resIconMap, resColorMap } from "../colors";
import PortModel from "../entities/PortModel";

type PortProps = {
  model: PortModel;
};

export class Port extends React.Component<PortProps, {}> {
  getIconDef() {
    const { resource: res } = this.props.model;
    if (res === "any") {
      return faQuestion;
    } else {
      return resIconMap[res];
    }
  }

  getIconColor() {
    const { resource: res } = this.props.model;
    if (res === "any") {
      return "#444444";
    } else {
      return resColorMap[res];
    }
  }

  render() {
    const { point } = this.props.model;
    const { boardPoint, positionOnTile } = point;
    const { boardXPos, boardYPos } = boardPoint;
    /**
     * 🔥🔥🔥🔥🔥🔥 HORRIBLE CODE ALERT 🔥🔥🔥🔥🔥🔥
     * This is easily some of the worst I've written, and I'm quite ashamed of it
     * If you think that you can fix how the ports are rendered, **PLEASE** do!
     * This is truly an epic fail that I'm only keeping in because I
     * really can't find much of a better solution without going way overboard
     */
    let x1 = xValofCorner(boardXPos, boardYPos, positionOnTile);
    let x2 = xValofCorner(boardXPos, boardYPos, positionOnTile + 1);
    let x = (x1 + x2) / 2;

    let y1 = yValofCorner(boardYPos, positionOnTile);
    const plusOne = positionOnTile + 1 === 6 ? 0 : positionOnTile + 1;
    let y2 = yValofCorner(boardYPos, plusOne);
    let y = (y1 + y2) / 2;

    const iconWidth = 25;
    const iconHeight = 20;

    x -= iconWidth;
    if (positionOnTile === 1) {
      x += iconWidth + 5;
      x += iconHeight;
    } else if (positionOnTile === 4) {
      x -= iconWidth - 5;
      x -= iconHeight;
    } else if (positionOnTile === 2 || positionOnTile === 3) {
      y += iconWidth;
      y += iconHeight;
    } else if (positionOnTile === 5 || positionOnTile === 0) {
      y -= iconWidth;
      y -= iconHeight;
    }

    const rotation = 60 * positionOnTile + 30;

    return (
      <div
        style={{
          zIndex: 1,
          position: "absolute",
          marginLeft: `${x}px`,
          marginTop: `${y - heightOfSVG / 2}px`,
          transform: `rotate(${rotation}deg)`,
          textAlign: "center",
        }}
      >
        <p>{this.props.model.getRatioNumber()}:1</p>
        <FontAwesomeIcon
          color={this.getIconColor()}
          size={"3x"}
          style={{
            stroke: "black",
            strokeWidth: 5,
          }}
          icon={this.getIconDef()}
        />
      </div>
    );
  }
}
