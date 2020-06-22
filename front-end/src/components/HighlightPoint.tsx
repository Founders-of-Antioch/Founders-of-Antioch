import React, { Component } from "react";
import { WHITE } from "../colors";
import { xValofCorner, yValofCorner } from "./Settlement";
import { widthOfSVG, hexRadius } from "./Board";
import { socket } from "../App";
import { isPlacingASettlement, isPlacingRoad } from "../redux/Actions";
import { FoAppState } from "../redux/reducers/reducers";
import { TileModel } from "../entities/TileModel";
import { connect, ConnectedProps } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { PlayerNumber } from "../../../types/Primitives";
import { ResourceChangePackage } from "../../../types/SocketPackages";

// Highlights a point where a player can build a settlement

type Props = {
  boardXPos: number;
  boardYPos: number;
  corner: number;
  playerWhoSelected: PlayerNumber;
  // Should be 'road' or 'settlement'
  typeOfHighlight: string;
};

type HPProps = {
  tiles: Array<TileModel>;
  turnNumber: number;
  inGamePlayerNumber: PlayerNumber;
};

function mapStateToProps(store: FoAppState): HPProps {
  return {
    tiles: store.boardToBePlayed.listOfTiles,
    turnNumber: store.turnNumber,
    inGamePlayerNumber: store.inGamePlayerNumber,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      isPlacingASettlement,
      isPlacingRoad,
    },
    dispatch
  );
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type HighlightProps = ReduxProps & Props;

class HighlightPoint extends Component<HighlightProps, {}> {
  constructor(props: HighlightProps) {
    super(props);
    this.selectedASettlementSpot = this.selectedASettlementSpot.bind(this);
    this.selectedARoadSpot = this.selectedARoadSpot.bind(this);
  }

  // TODO: Replace with actual gameID
  selectedASettlementSpot(): void {
    const {
      boardXPos,
      boardYPos,
      corner,
      playerWhoSelected,
      turnNumber,
    } = this.props;
    // Emit change for broadcast
    socket.emit(
      "addBuilding",
      "1",
      boardXPos,
      boardYPos,
      corner,
      playerWhoSelected,
      this.props.tiles
    );

    console.log(boardXPos, boardYPos, corner);

    this.props.isPlacingASettlement(false);
    this.props.isPlacingRoad(turnNumber <= 2);
  }

  selectedARoadSpot(): void {
    const {
      boardXPos,
      boardYPos,
      playerWhoSelected,
      corner,
      inGamePlayerNumber,
      turnNumber,
    } = this.props;

    // TODO: Replace with actual gameID
    socket.emit(
      "addRoad",
      "1",
      boardXPos,
      boardYPos,
      corner,
      playerWhoSelected
    );

    this.props.isPlacingRoad(false);
    // Don't have to purchase roads if it's the snake draft
    // TODO: Fix Game ID
    if (turnNumber > 2) {
      const roadPKG: ResourceChangePackage = {
        gameID: "1",
        resourceDeltaMap: { brick: -1, wood: -1 },
        playerNumber: inGamePlayerNumber,
      };
      socket.emit("resourceChange", roadPKG);
    }
  }

  render() {
    const { boardXPos, boardYPos, corner, typeOfHighlight } = this.props;

    let x = xValofCorner(boardXPos, boardYPos, corner);
    let y = yValofCorner(boardYPos, corner);

    const isRoad = typeOfHighlight === "road";

    // Special garbo adjustment if it's a road highlight
    if (isRoad) {
      const sign = corner < 3 ? 1 : -1;

      if (corner === 0 || corner === 5) {
        x += (hexRadius * Math.sqrt(3)) / 4;
        y = y + (hexRadius / 4) * sign;
      } else if (corner === 2 || corner === 3) {
        x -= (hexRadius * Math.sqrt(3)) / 4;
        y = y + (hexRadius / 4) * sign;
      } else {
        y = y + (hexRadius / 2) * sign;
      }
    }

    return (
      <circle
        id={`${this.props.boardXPos}-${this.props.boardYPos}-${this.props.corner}`}
        cx={x}
        cy={y}
        r={widthOfSVG / 100}
        stroke={WHITE}
        // TODO: Change to dynamic
        strokeWidth={2}
        cursor="pointer"
        fill="white"
        fillOpacity={0.25}
        onClick={isRoad ? this.selectedARoadSpot : this.selectedASettlementSpot}
      />
    );
  }
}

export default connector(HighlightPoint);
