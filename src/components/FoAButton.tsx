import React from "react";
import { WHEAT, WHITE, DARK_WHEAT } from "../colors";
import "../Button.css";
import { widthOfSVG, heightOfSVG } from "./Board";

type btnProps = {
  width: number;
  height: number;
  canEndTurn: boolean;
};

export class FoAButton extends React.Component<btnProps, {}> {
  render() {
    const { width, height, canEndTurn } = this.props;

    const buttonMarginX = height / 10;
    const buttonMarginY = height / 10;

    const textHeight = height * 0.6;

    const bkgX = widthOfSVG / 2 - width / 2;
    const bkgY = heightOfSVG - height;

    const op = canEndTurn ? 1.0 : 0.7;

    return (
      <g>
        <rect
          x={bkgX}
          y={bkgY - buttonMarginY}
          fill={WHEAT}
          width={width}
          rx={15}
          height={height}
          onClick={() => console.log(1)}
          opacity={op}
        />

        <g
          className={canEndTurn ? "buttonGroup" : ""}
          onClick={() => console.log(1)}
        >
          <rect
            className={"insideButton"}
            x={bkgX + buttonMarginX}
            y={bkgY}
            opacity={op}
            rx={15}
            width={width - 2 * buttonMarginX}
            height={height - 2 * buttonMarginY}
          />

          <text
            className={"insideText"}
            x={"50%"}
            y={bkgY + textHeight}
            textAnchor={"middle"}
            fill={WHITE}
            opacity={op}
            fontWeight={"bold"}
            fontSize={textHeight}
          >
            End Turn
          </text>
        </g>
      </g>
    );
  }
}
