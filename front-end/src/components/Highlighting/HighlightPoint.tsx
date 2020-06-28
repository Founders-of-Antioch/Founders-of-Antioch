import React, { Component } from "react";
import { PlayerNumber } from "../../../../types/Primitives";
import { FoAppState } from "../../redux/reducers/reducers";
import { bindActionCreators } from "redux";
import { ConnectedProps, connect } from "react-redux";
import { socket } from "../../App";
import {
  ResourceChangePackage,
  MoveRobberPackage,
  BuildingUpdatePackage,
} from "../../../../types/SocketPackages";
import {
  xValofCorner,
  yValofCorner,
  centerTileX,
  centerTileY,
} from "../Settlement";
import { hexRadius, widthOfSVG } from "../Board";
import { WHITE, PLAYER_COLORS } from "../../colors";
import { Dispatch } from "redux";
import {
  isPlacingASettlement,
  isPlacingRoad,
  isPlacingACity,
  playerIsPlacingRobber,
  declareStealingInfo,
} from "../../redux/Actions";
import { tilesPointIsOn } from "../../entities/TilePointHelper";
import BoardPoint from "../../entities/Points/BoardPoint";

export type HighlightType = "settlement" | "road" | "robber" | "city";

type Props = {
  boardXPos: number;
  boardYPos: number;
  corner: number;
  playerWhoSelected: PlayerNumber;
  typeOfHighlight: HighlightType;
};

function mapStateToProps(store: FoAppState) {
  return {
    tiles: store.boardToBePlayed.listOfTiles,
    turnNumber: store.turnNumber,
    inGamePlayerNumber: store.inGamePlayerNumber,
    playersByID: store.playersByID,
    boardToBePlayed: store.boardToBePlayed,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      isPlacingASettlement,
      isPlacingRoad,
      isPlacingACity,
      playerIsPlacingRobber,
      declareStealingInfo,
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
    this.selectedARobberSpot = this.selectedARobberSpot.bind(this);
    this.selectedACitySpot = this.selectedACitySpot.bind(this);
    this.getOnClick = this.getOnClick.bind(this);
  }

  // TODO: Replace with game ID
  selectedACitySpot() {
    const {
      boardXPos,
      boardYPos,
      corner,
      playerWhoSelected,
      inGamePlayerNumber,
    } = this.props;

    const pkg: BuildingUpdatePackage = {
      gameID: "1",
      boardXPos,
      boardYPos,
      corner,
      playerNum: playerWhoSelected,
      typeOfBuilding: "city",
    };

    // Emit change for broadcast
    socket.emit("addBuilding", pkg);

    this.props.isPlacingACity(false);
    // TODO: Fix Game ID
    const roadPKG: ResourceChangePackage = {
      gameID: "1",
      resourceDeltaMap: { wheat: -2, ore: -3 },
      playerNumber: inGamePlayerNumber,
    };
    socket.emit("resourceChange", roadPKG);
  }

  // TODO: Replace with actual gameID
  selectedASettlementSpot(): void {
    const {
      boardXPos,
      boardYPos,
      corner,
      playerWhoSelected,
      turnNumber,
      inGamePlayerNumber,
      boardToBePlayed,
    } = this.props;

    const pkg: BuildingUpdatePackage = {
      gameID: "1",
      boardXPos,
      boardYPos,
      corner,
      playerNum: playerWhoSelected,
      typeOfBuilding: "settlement",
    };

    // Emit change for broadcast
    socket.emit("addBuilding", pkg);

    this.props.isPlacingASettlement(false);
    this.props.isPlacingRoad(turnNumber <= 2);

    if (turnNumber === 2) {
      const touchingTiles = tilesPointIsOn(boardToBePlayed.listOfTiles, {
        boardXPos,
        boardYPos,
        corner,
      });
      let resMap: { [index: string]: number } = {};
      for (const tile of touchingTiles) {
        if (tile.resource in resMap) {
          resMap[tile.resource] += 1;
        } else {
          resMap[tile.resource] = 1;
        }
      }

      const pkg: ResourceChangePackage = {
        gameID: "1",
        resourceDeltaMap: resMap,
        playerNumber: inGamePlayerNumber,
      };
      socket.emit("resourceChange", pkg);
    }

    // Don't have to purchase settlements if it's the snake draft
    // TODO: Fix Game ID
    if (turnNumber > 2) {
      const pkg: ResourceChangePackage = {
        gameID: "1",
        resourceDeltaMap: { brick: -1, wood: -1, sheep: -1, wheat: -1 },
        playerNumber: inGamePlayerNumber,
      };
      socket.emit("resourceChange", pkg);
    }
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

  // TODO: Fix GameID
  selectedARobberSpot() {
    const {
      boardXPos,
      boardYPos,
      playersByID,
      inGamePlayerNumber,
    } = this.props;
    const pkg: MoveRobberPackage = {
      gameID: "1",
      boardXPos,
      boardYPos,
    };

    let availablePlayersToStealFrom: Array<PlayerNumber> = [];
    PlayerLoop: for (const currPlayer of playersByID.values()) {
      for (const currBuild of currPlayer.buildings) {
        for (const currTile of currBuild.touchingTiles) {
          if (
            currTile.point.equals(new BoardPoint(boardXPos, boardYPos)) &&
            currPlayer.playerNum !== inGamePlayerNumber &&
            currPlayer.numberOfCardsInHand() !== 0
          ) {
            availablePlayersToStealFrom.push(currPlayer.playerNum);
            continue PlayerLoop;
          }
        }
      }
    }

    if (availablePlayersToStealFrom.length !== 0) {
      this.props.declareStealingInfo(true, availablePlayersToStealFrom);
    }

    this.props.playerIsPlacingRobber(false);
    socket.emit("moveRobber", pkg);
  }

  getOnClick() {
    switch (this.props.typeOfHighlight) {
      case "settlement":
        return this.selectedASettlementSpot;
      case "road":
        return this.selectedARoadSpot;
      case "robber":
        return this.selectedARobberSpot;
      case "city":
        return this.selectedACitySpot;
      default:
        return () => {
          console.log("On click for highlighted component not found");
        };
    }
  }

  render() {
    const { boardXPos, boardYPos, corner, typeOfHighlight } = this.props;

    const isRoad = typeOfHighlight === "road";
    const isRobber = typeOfHighlight === "robber";

    let x = xValofCorner(boardXPos, boardYPos, corner);
    let y = yValofCorner(boardYPos, corner);

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
    } else if (isRobber) {
      x = centerTileX(boardXPos, boardYPos);
      y = centerTileY(boardYPos);
    } else {
      // Settlement
    }

    const playerRed = PLAYER_COLORS.get(2);

    return (
      <circle
        id={`${boardXPos}:${boardYPos}:${corner}`}
        cx={x}
        cy={y}
        r={widthOfSVG / 100}
        stroke={isRobber ? playerRed : WHITE}
        // TODO: Change to dynamic
        strokeWidth={2}
        cursor="pointer"
        fill={isRobber ? playerRed : WHITE}
        fillOpacity={0.25}
        onClick={this.getOnClick()}
      />
    );
  }
}

export default connector(HighlightPoint);
