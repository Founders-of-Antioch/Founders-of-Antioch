import React from "react";
import { Tile } from "./Tile";
import { Frame } from "./Frame";
import { Port } from "./Port";
import Robber from "./Robber";
import { TileModel } from "../entities/TIleModel";
import { centerTileX, centerTileY } from "./Settlement";
import { FoAppState } from "../redux/reducers/reducers";
import { connect } from "react-redux";

// TODO: Change these to be function instea of constants so the screen will update on a re-render
export let widthOfSVG = Number(document.getElementById("root")?.offsetWidth);
export let heightOfSVG = Number(document.getElementById("root")?.offsetHeight);

// TODO: Change to be based off the width(?)
export const hexRadius = heightOfSVG / 12;
// Approximate ratio, but might need to be changed for port design
const frameRadius = 5.5 * hexRadius;

export interface BoardProps {
  listOfTiles: Array<TileModel>;
}

function mapStateToProps(store: FoAppState): BoardProps {
  return { listOfTiles: store.boardToBePlayed.listOfTiles };
}

class Board extends React.Component<BoardProps, {}> {
  createTiles() {
    const { listOfTiles } = this.props;
    let tileCompoonentList = [];
    let key = 0;

    for (const tileToRender of listOfTiles) {
      const centerX = centerTileX(
        tileToRender.boardXPos,
        tileToRender.boardYPos
      );
      const centerY = centerTileY(tileToRender.boardYPos);

      tileCompoonentList.push(
        <Tile
          key={key++}
          hexRad={hexRadius}
          resource={tileToRender.resource}
          tipX={centerX}
          tipY={centerY - hexRadius}
          counter={tileToRender.counter}
        />
      );
    }

    return tileCompoonentList;
  }

  // WIP
  constructPorts() {
    let portsArr = [];
    for (let i = 0; i < 9; i++) {
      portsArr.push(
        <Port
          imgX={widthOfSVG / 2 + (2.5 + 0.25) * Math.sqrt(3) * hexRadius}
          imgY={heightOfSVG / 2}
        />
      );
    }

    return portsArr;
  }

  render() {
    return (
      <g>
        <Frame
          frameRadius={frameRadius}
          centerX={widthOfSVG / 2}
          centerY={heightOfSVG / 2}
        />
        {this.createTiles()}
        <Robber />

        {/* Vertical and horizontal center lines to check for styling. Uncomment if you want to check if something is centered */}
        {/* <polyline
          points={`${widthOfSVG / 2},0 ${widthOfSVG / 2},${heightOfSVG}`}
          stroke="yellow"
          strokeWidth="3"
        />
        <polyline
          points={`0,${heightOfSVG / 2} ${widthOfSVG},${heightOfSVG / 2}`}
          stroke="yellow"
          strokeWidth="3"
        /> */}
      </g>
    );
  }
}

export default connect(mapStateToProps)(Board);
