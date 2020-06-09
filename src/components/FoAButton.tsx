import React from "react";
import { WHEAT, WHITE } from "../colors";
import "../Button.css";
import { widthOfSVG, heightOfSVG } from "./Board";
import { diceLength } from "./Dice";

// TODO: class should be renamed

type btnProps = {
  width: number;
  height: number;
  canEndTurn: boolean;
  onClick: (event: React.MouseEvent) => void;
};

export class FoAButton extends React.Component<btnProps, {}> {
  render() {
    const { width, height, canEndTurn, onClick } = this.props;

    const buttonMarginX = height / 10;
    const buttonMarginY = height / 10;

    const textHeight = height * 0.6;

    const bkgX = (widthOfSVG * 4) / 5;
    const bkgY = heightOfSVG / 2 + diceLength;

    const op = canEndTurn ? 1.0 : 0.7;

    const innerButtonWidth = width - 2 * buttonMarginX;

    return (
      <g>
        <rect
          x={bkgX}
          y={bkgY - buttonMarginY}
          fill={WHEAT}
          width={width}
          rx={15}
          height={height}
          opacity={op}
        />

        <g
          className={canEndTurn ? "buttonGroup" : ""}
          onClick={canEndTurn ? onClick : () => {}}
        >
          <rect
            className={"insideButton"}
            x={bkgX + buttonMarginX}
            y={bkgY}
            opacity={op}
            // TODO: Make dynamic
            rx={15}
            width={innerButtonWidth}
            height={height - 2 * buttonMarginY}
          />

          <text
            className={"insideText"}
            x={bkgX + buttonMarginX + innerButtonWidth / 2}
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
