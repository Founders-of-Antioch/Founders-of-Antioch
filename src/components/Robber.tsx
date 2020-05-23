import React from "react";
import { widthOfSVG, heightOfSVG, hexRadius } from "./Board";
import robber from "../icons/robber.svg";

// Center tile is 0,0 - going right is pos and left neg, up pos and down neg, just like a standard XY coordinate system. E.g. top left tile is -1, 2
type RobberState = {
  boardXPos: number;
  boardYPos: number;
};

type RobberProps = {
  boardResources: Array<string>;
};

export class Robber extends React.Component<RobberProps, RobberState> {
  constructor(props: RobberProps) {
    super(props);
    this.state = {
      boardXPos: 0,
      boardYPos: 0,
    };
  }

  componentDidMount() {
    this.findDesertTileCoordinates();
  }

  findDesertTileCoordinates(): Array<number> {
    const { boardResources } = this.props;

    let desertX = -1;
    let desertY = 2;
    for (let i = 0; i < boardResources.length; i++) {
      const currentRes = boardResources[i];
      // Dumpster fire
      if (i < 6) {
        if (i % 2 === 0 && i !== 0) {
          desertX++;
        }
        desertY = 2 * ((i + 1) % 2 === 0 ? -1 : 1);
      } else if (i >= 6 && i < 14) {
        if (i === 6) {
          desertX = -2;
        } else if (i % 2 === 0) {
          desertX++;
        }

        if (desertX === 0) {
          desertX = 1;
        }
        desertY = i % 2 === 0 ? 1 : -1;
      } else if (i >= 14) {
        desertX = i - 16;
        desertY = 0;
      }

      if (currentRes === "desert") {
        this.setState({
          boardXPos: desertX,
          boardYPos: desertY,
        });
        return [desertX, desertY];
      }
    }

    return [0, 0];
  }

  actualX() {
    const { boardXPos, boardYPos } = this.state;

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

  actualY() {
    const { boardYPos } = this.state;
    return heightOfSVG / 2 - boardYPos * 1.5 * hexRadius;
  }

  render() {
    const actX = this.actualX();
    const actY = this.actualY();
    const widthOfIcon = hexRadius / 2;

    return (
      <g>
        <circle fill="black" r={hexRadius / 3} cx={actX} cy={actY} />
        <image
          href={robber}
          x={actX - widthOfIcon / 2}
          y={actY - widthOfIcon / 2}
          width={widthOfIcon}
          height={widthOfIcon}
        />
      </g>
    );
  }
}
