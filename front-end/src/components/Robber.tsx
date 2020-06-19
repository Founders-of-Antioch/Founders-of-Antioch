import React from "react";
import { hexRadius } from "./Board";
import robber from "../icons/robber.svg";
import { TileModel } from "../entities/TIleModel";
import { centerTileX, centerTileY } from "./Settlement";
import { FoAppState } from "../redux/reducers/reducers";
import { connect } from "react-redux";

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
    this.findDesertTileCoordinates = this.findDesertTileCoordinates.bind(this);
  }

  findDesertTileCoordinates() {
    for (const t of this.props.listOfTiles) {
      if (t.resource === "desert") {
        return [t.boardXPos, t.boardYPos];
      }
    }

    return [0, 0];
  }

  render() {
    const dTiles = this.findDesertTileCoordinates();
    const boardXPos = dTiles[0];
    const boardYPos = dTiles[1];

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
