import React from "react";
import { widthOfSVG, heightOfSVG, hexRadius } from "./Board";
import robber from "../icons/robber.svg";
import { TileModel } from "../entities/TIleModel";
import { centerTileX, centerTileY } from "./Settlement";

// Center tile is 0,0 - going right is pos and left neg, up pos and down neg, just like a standard XY coordinate system. E.g. top left tile is -1, 2
type RobberState = {
  boardXPos: number;
  boardYPos: number;
};

type RobberProps = {
  listOfTiles: Array<TileModel>;
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

  findDesertTileCoordinates() {
    for (const t of this.props.listOfTiles) {
      if (t.resource === "desert") {
        this.setState({
          boardXPos: t.boardXPos,
          boardYPos: t.boardYPos,
        });
      }
    }
  }

  // actualX() {
  //   const { boardXPos, boardYPos } = this.state;

  //   // The first 'row' above the middle is shifted
  //   let adjustXPos = boardXPos;
  //   //If it is in the row above the middle and to the left of the center
  //   if (boardXPos < 0 && (boardYPos === -1 || boardYPos === 1)) {
  //     adjustXPos += 0.5;
  //   } else if ((boardYPos === -1 || boardYPos === 1) && boardXPos > 0) {
  //     //If it is in the row above the middle and to the right of the center
  //     adjustXPos -= 0.5;
  //   }

  //   return adjustXPos * Math.sqrt(3) * hexRadius + widthOfSVG / 2;
  // }

  // actualY() {
  //   const { boardYPos } = this.state;
  //   return heightOfSVG / 2 - boardYPos * 1.5 * hexRadius;
  // }

  render() {
    const { boardXPos, boardYPos } = this.state;

    const actX = centerTileX(boardXPos, boardYPos);
    const actY = centerTileY(boardYPos);
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
