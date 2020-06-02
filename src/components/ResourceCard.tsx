import React from "react";
import { SAND } from "../colors";
import brick from "../icons/brick.svg";
import trees from "../icons/trees.svg";
import { widthOfSVG, heightOfSVG } from "./Board";

export class ResourceCard extends React.Component<{}, {}> {
  render() {
    const cardWidth = widthOfSVG / 15;
    const cardHeight = (cardWidth * 4) / 3;
    const iconWidth = (cardWidth * 2) / 3;

    const cardX = widthOfSVG / 2;
    const cardY = heightOfSVG - cardHeight;
    return (
      <g>
        <rect
          width={cardWidth}
          height={cardHeight}
          x={cardX}
          y={cardY}
          rx={cardWidth / 7}
          ry={cardWidth / 7}
          fill={"wheat"}
        />
        <image
          x={cardWidth / 6 + cardX}
          y={cardHeight / 2 - iconWidth / 2 + cardY}
          href={trees}
          width={iconWidth}
        />
      </g>
    );
  }
}
