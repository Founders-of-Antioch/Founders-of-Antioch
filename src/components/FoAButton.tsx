import React from "react";
import { WHEAT, WHITE, DARK_WHEAT } from "../colors";
import "../Button.css";

type btnProps = {
  width: number;
  height: number;
  canEndTurn: boolean;
};

export class FoAButton extends React.Component<btnProps, {}> {
  constructor(props: btnProps) {
    super(props);
    // this.state = {
    //   disabled: true,
    // };
  }

  render() {
    const { width, height, canEndTurn } = this.props;

    const buttonMarginX = width / 10;
    const buttonMarginY = height / 10;

    const textHeight = height * 0.6;

    return (
      <g>
        <rect
          x={0}
          y={0}
          fill={WHEAT}
          width={width}
          height={height}
          onClick={() => console.log(1)}
        />

        <g className={"buttonGroup"} onClick={() => console.log(1)}>
          <rect
            className="insideButton"
            x={0 + buttonMarginX}
            y={0 + buttonMarginY}
            width={width - 2 * buttonMarginX}
            height={height - 2 * buttonMarginY}
          />

          <text
            className={"insideText"}
            x={0 + buttonMarginX}
            y={0 + buttonMarginY + textHeight}
            fill={canEndTurn ? WHITE : "black"}
            fontSize={textHeight}
          >
            E
          </text>
        </g>
      </g>
    );
  }
}
