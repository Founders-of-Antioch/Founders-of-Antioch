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
  AddRoadPackage,
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
  playerIsPlayingRoadDevCard,
  playExtraRoadForPlayer,
} from "../../redux/Actions";
import { tilesPointIsOn } from "../../entities/TilePointHelper";
import BoardPoint from "../../entities/Points/BoardPoint";
import TilePoint from "../../entities/Points/TilePoint";

export type HighlightType = "settlement" | "road" | "robber" | "city";

type Props = {
  point: TilePoint;
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
    isPlayingRoadDevCard: store.isPlayingRoadDevCard,
    numberExtraRoads: store.extraRoadsPlayed,
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
      playerIsPlayingRoadDevCard,
      playExtraRoadForPlayer,
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
    const { playerWhoSelected, inGamePlayerNumber, point } = this.props;

    const { boardPoint, positionOnTile } = point;
    const { boardXPos, boardYPos } = boardPoint;

    const pkg: BuildingUpdatePackage = {
      gameID: "1",
      boardXPos,
      boardYPos,
      positionOnTile,
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
      point,
      playerWhoSelected,
      turnNumber,
      inGamePlayerNumber,
      boardToBePlayed,
    } = this.props;

    const { boardPoint, positionOnTile } = point;
    const { boardXPos, boardYPos } = boardPoint;

    const pkg: BuildingUpdatePackage = {
      gameID: "1",
      boardXPos,
      boardYPos,
      positionOnTile,
      playerNum: playerWhoSelected,
      typeOfBuilding: "settlement",
    };

    // Emit change for broadcast
    socket.emit("addBuilding", pkg);

    this.props.isPlacingASettlement(false);
    this.props.isPlacingRoad(turnNumber <= 2);

    if (turnNumber === 2) {
      const touchingTiles = tilesPointIsOn(boardToBePlayed.listOfTiles, point);
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
      point,
      playerWhoSelected,
      inGamePlayerNumber,
      turnNumber,
      isPlayingRoadDevCard,
      numberExtraRoads,
    } = this.props;

    if (isPlayingRoadDevCard) {
      if (numberExtraRoads + 1 < 2) {
        this.props.playExtraRoadForPlayer();
      } else {
        this.props.playerIsPlayingRoadDevCard(false);
      }
    }

    const { boardPoint, positionOnTile } = point;
    const { boardXPos, boardYPos } = boardPoint;

    const pkg: AddRoadPackage = {
      boardXPos,
      boardYPos,
      positionOnTile,
      gameID: "1",
      playerNum: playerWhoSelected,
    };

    // TODO: Replace with actual gameID
    socket.emit("addRoad", pkg);

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
    const { point, playersByID, inGamePlayerNumber } = this.props;
    const { boardPoint } = point;
    const { boardXPos, boardYPos } = boardPoint;

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
    const { point, typeOfHighlight } = this.props;
    const { boardPoint, positionOnTile: corner } = point;
    const { boardXPos, boardYPos } = boardPoint;

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
