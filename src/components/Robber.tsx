import React from "react";
import { hexRadius } from "./Board";
import robber from "../icons/robber.svg";
import { TileModel } from "../entities/TIleModel";
import { centerTileX, centerTileY } from "./Settlement";
import { FoAppState } from "../redux/reducers/reducers";
import { connect } from "react-redux";
import store from "../redux/store";

// Center tile is 0,0 - going right is pos and left neg, up pos and down neg, just like a standard XY coordinate system. E.g. top left tile is -1, 2
// type RobberState = {
//   boardXPos: number;
//   boardYPos: number;
// };

type RobberProps = {
  listOfTiles: Array<TileModel>;
};

function mapStateToProps(store: FoAppState): RobberProps {
  return {
    listOfTiles: store.boardToBePlayed.listOfTiles,
  };
}

class Robber extends React.Component<RobberProps, {}> {
  constructor(props: RobberProps) {
    super(props);
    // this.state = {
    //   boardXPos: 0,
    //   boardYPos: 0,
    // };
    this.findDesertTileCoordinates = this.findDesertTileCoordinates.bind(this);
  }

  findDesertTileCoordinates() {
    for (const t of this.props.listOfTiles) {
      if (t.resource === "desert") {
        // this.setState({
        //   boardXPos: t.boardXPos,
        //   boardYPos: t.boardYPos,
        // });
        return [t.boardXPos, t.boardYPos];
      }
    }

    return [0, 0];
  }

  render() {
    store.subscribe(this.findDesertTileCoordinates);
    // const { boardXPos, boardYPos } = this.state;
    const dTiles = this.findDesertTileCoordinates();
    const boardXPos = dTiles[0];
    const boardYPos = dTiles[0];

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

export default connect(mapStateToProps)(Robber);
