import React from "react";
import road from "../road.svg";
import shield from "../shield.svg";

import { widthOfSVG, heightOfSVG } from "./Board";

const rectWidth = widthOfSVG / 5;
const rectHeight = heightOfSVG / 5;

export class PlayerCard extends React.Component<{}, {}> {
  render() {
    const widthOfMiniIcons = rectWidth / 10;
    const profileImageWidth = rectWidth / 3;

    return (
      <g>
        <rect
          x={0}
          y={0}
          width={rectWidth}
          height={rectHeight}
          fill={"#484848"}
          opacity={0.8}
        />
        <rect
          x={0}
          y={0}
          width={profileImageWidth}
          height={profileImageWidth}
          fill="red"
        />
        <g>
          <g>
            <image
              x={profileImageWidth + rectWidth / 24}
              y={0}
              width={widthOfMiniIcons}
              height={widthOfMiniIcons}
              href={road}
            />
            <text
              x={profileImageWidth + rectWidth / 12 + widthOfMiniIcons}
              y={widthOfMiniIcons - widthOfMiniIcons / 5}
              fontFamily="Courier New"
              fontSize={widthOfMiniIcons}
              fill="white"
            >
              5
            </text>
          </g>
          <g>
            <image
              x={
                profileImageWidth +
                rectWidth / 12 +
                widthOfMiniIcons +
                widthOfMiniIcons
              }
              y={0}
              width={widthOfMiniIcons}
              height={widthOfMiniIcons}
              href={shield}
            />
            <text
              x={
                profileImageWidth +
                rectWidth / 4.5 +
                widthOfMiniIcons +
                widthOfMiniIcons
              }
              y={widthOfMiniIcons - widthOfMiniIcons / 5}
              fontFamily="Courier New"
              fontSize={widthOfMiniIcons}
              fill="white"
            >
              3
            </text>
          </g>
        </g>
      </g>
    );
  }
}
