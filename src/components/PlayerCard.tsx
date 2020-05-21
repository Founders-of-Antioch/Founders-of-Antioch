import React from "react";
import road from "../road.svg";

import { widthOfSVG, heightOfSVG } from "./Board";

const rectWidth = widthOfSVG / 5;
const rectHeight = heightOfSVG / 5;

export class PlayerCard extends React.Component<{}, {}> {
  render() {
    return (
      <g>
        <rect
          x={0}
          y={0}
          width={rectWidth}
          height={rectHeight}
          fill={"steelblue"}
          opacity={0.8}
        />
        <rect
          x={0}
          y={0}
          width={rectWidth / 3}
          height={rectWidth / 3}
          fill="black"
        />
        <g>
          <image
            x={rectWidth / 3 + rectWidth / 12}
            y={0}
            width={rectWidth / 6}
            height={rectWidth / 6}
            href={road}
          />
          <text
            x={rectWidth / 3 + rectWidth / 3}
            y={30}
            // fontWeight="bold"
            fontSize={30}
            fill="white"
          >
            5
          </text>
        </g>
      </g>
    );
  }
}
