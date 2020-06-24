import React, { Component } from "react";
import {
  areSamePoints,
  pointsAreOneApart,
} from "../../entities/TilePointHelper";
import HighlightPoint, { HighlightType } from "./HighlightPoint";
import { PlayerNumber } from "../../../../types/Primitives";
import { TileModel } from "../../entities/TileModel";
import { Player } from "../../entities/Player";
import { FoAppState, RobberCoordinates } from "../../redux/reducers/reducers";
import { connect, ConnectedProps } from "react-redux";
import store from "../../redux/store";

export const LIST_HIGHLIGHT_TYPES: Array<HighlightType> = [
  "settlement",
  "road",
  "robber",
];

type SetProps = {
  playersByID: Map<PlayerNumber, Player>;
  currentPersonPlaying: PlayerNumber;
  inGamePlayerNumber: PlayerNumber;
  isCurrentlyPlacingSettlement: boolean;
  isCurrentlyPlacingRoad: boolean;
  isCurrentlyPlacingRobber: boolean;
  boardToBePlayed: { listOfTiles: Array<TileModel>; gameID: string };
  robberCoordinates: RobberCoordinates;
};

function mapStateToProps(store: FoAppState): SetProps {
  return {
    playersByID: store.playersByID,
    currentPersonPlaying: store.currentPersonPlaying,
    inGamePlayerNumber: store.inGamePlayerNumber,
    isCurrentlyPlacingSettlement: store.isCurrentlyPlacingSettlement,
    isCurrentlyPlacingRoad: store.isCurrentlyPlacingRoad,
    isCurrentlyPlacingRobber: store.isCurrentlyPlacingRobber,
    boardToBePlayed: store.boardToBePlayed,
    robberCoordinates: store.robberCoordinates,
  };
}

const connector = connect(mapStateToProps);
type RedProps = ConnectedProps<typeof connector>;

class HighlightSet extends Component<RedProps, {}> {
  constructor(props: RedProps) {
    super(props);

    this.highlightNeededSpaces = this.highlightNeededSpaces.bind(this);
    store.subscribe(this.highlightNeededSpaces);
  }

  highlightNeededSpaces() {
    const {
      isCurrentlyPlacingSettlement,
      isCurrentlyPlacingRoad,
      isCurrentlyPlacingRobber,
    } = this.props;

    if (isCurrentlyPlacingRoad) {
      return this.makeHighlightSet("road");
    } else if (isCurrentlyPlacingSettlement) {
      return this.makeHighlightSet("settlement");
    } else if (isCurrentlyPlacingRobber) {
      return this.makeRobberHighlights();
    } else {
      return null;
    }
  }

  makeRobberHighlights() {
    const {
      boardToBePlayed,
      inGamePlayerNumber,
      robberCoordinates,
    } = this.props;

    let key = 0;
    let arr = [];
    for (const currTile of boardToBePlayed.listOfTiles) {
      if (
        currTile.boardXPos !== robberCoordinates.boardXPos ||
        currTile.boardYPos !== robberCoordinates.boardYPos
      ) {
        arr.push(
          <HighlightPoint
            key={key++}
            typeOfHighlight={"robber"}
            boardXPos={currTile.boardXPos}
            boardYPos={currTile.boardYPos}
            corner={-1}
            playerWhoSelected={inGamePlayerNumber}
          />
        );
      }
    }

    return arr;
  }

  makeHighlightSet(typeOfHighlight: HighlightType) {
    const {
      playersByID,
      currentPersonPlaying,
      inGamePlayerNumber,
      isCurrentlyPlacingSettlement,
      isCurrentlyPlacingRoad,
      boardToBePlayed,
    } = this.props;

    const { listOfTiles } = boardToBePlayed;

    const isTurn = currentPersonPlaying === inGamePlayerNumber;
    const placing =
      typeOfHighlight === "road"
        ? isCurrentlyPlacingRoad
        : isCurrentlyPlacingSettlement;

    if (isTurn && placing) {
      const spots = [];
      let keyForHighlights = 0;

      for (let x = 2; x >= -2; x--) {
        const numRows = 5 - Math.abs(x);
        let y = 2;
        if (x < 0) {
          y -= Math.abs(x);
        }

        let numRowsDone = 0;
        for (; numRowsDone < numRows; y--) {
          cornerLoop: for (let corner = 0; corner <= 5; corner++) {
            // If there is already a building in the spot, don't highlight it
            if (typeOfHighlight !== "road") {
              for (const pl of playersByID.values()) {
                for (const setl of pl.buildings) {
                  const p1 = { boardXPos: x, boardYPos: y, corner };
                  const p2 = {
                    boardXPos: setl.boardXPos,
                    boardYPos: setl.boardYPos,
                    corner: setl.corner,
                  };

                  if (
                    areSamePoints(listOfTiles, p1, p2) ||
                    pointsAreOneApart(p1, p2)
                  ) {
                    continue cornerLoop;
                  }
                }
              }
            } else {
              // Roads
            }

            spots.push(
              <HighlightPoint
                key={keyForHighlights++}
                boardXPos={x}
                boardYPos={y}
                corner={corner}
                playerWhoSelected={inGamePlayerNumber}
                typeOfHighlight={typeOfHighlight}
              />
            );
          }

          numRowsDone++;
        }
      }
      return spots;
    } else {
      return null;
    }
  }

  render() {
    return this.highlightNeededSpaces();
  }
}

export default connector(HighlightSet);
