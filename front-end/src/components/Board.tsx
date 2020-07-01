import React from "react";
import { Tile } from "./Tile";
import { Frame } from "./Frame";
// import { Port } from "./Port";
import Robber from "./Robber";
import { TileModel } from "../entities/TileModel";
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
        tileToRender.point.boardXPos,
        tileToRender.point.boardYPos
      );
      const centerY = centerTileY(tileToRender.point.boardYPos);

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
        {/* <text
          style={{
            fontFamily: "FontAwesome",
            fontSize: "10em",
            zIndex: 2,
          }}
          y={300}
          id="foo"
        /> */}
      </g>
    );
  }
}

export default connect(mapStateToProps)(Board);
