import React from "react";
import { hexRadius } from "./Board";
import robber from "../icons/robber.svg";
import { TileModel } from "../entities/TileModel";
import { centerTileX, centerTileY } from "./Settlement";
import { FoAppState, RobberCoordinates } from "../redux/reducers/reducers";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators } from "redux";
import { moveRobberTo } from "../redux/Actions";
import { Dispatch } from "redux";

type RobberProps = {
  listOfTiles: Array<TileModel>;
  robberCoordinates: RobberCoordinates;
};

function mapStateToProps(store: FoAppState): RobberProps {
  return {
    listOfTiles: store.boardToBePlayed.listOfTiles,
    robberCoordinates: store.robberCoordinates,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({ moveRobberTo }, dispatch);
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type RobberRedProps = ConnectedProps<typeof connector>;

type UIState = {
  foundDesert: boolean;
};

class Robber extends React.Component<RobberRedProps, UIState> {
  constructor(props: RobberRedProps) {
    super(props);
    this.state = { foundDesert: false };
    this.findDesertTileCoordinates = this.findDesertTileCoordinates.bind(this);
  }

  componentDidUpdate() {
    if (!this.state.foundDesert) {
      this.findDesertTileCoordinates();
    }
  }

  findDesertTileCoordinates() {
    for (const t of this.props.listOfTiles) {
      if (t.resource === "desert") {
        this.setState({ foundDesert: true });
        this.props.moveRobberTo(t.boardXPos, t.boardYPos);
        return;
      }
    }
  }

  render() {
    const { boardXPos, boardYPos } = this.props.robberCoordinates;

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

export default connector(Robber);
