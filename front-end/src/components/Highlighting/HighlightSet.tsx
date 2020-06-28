import React, { Component } from "react";
import {
  areSamePoints,
  pointsAreOneApart,
  getEquivPoints,
  getOneAwayRoadSpots,
  pointIsInBounds,
  roadPointToTouchingBuildingPoints,
  canPutBuildingOn,
  roadSpaceIsOccupied,
} from "../../entities/TilePointHelper";
import HighlightPoint, { HighlightType } from "./HighlightPoint";
import { FoAppState } from "../../redux/reducers/reducers";
import { connect, ConnectedProps } from "react-redux";
import store from "../../redux/store";
import BoardPoint from "../../entities/Points/BoardPoint";

export const LIST_HIGHLIGHT_TYPES: Array<HighlightType> = [
  "settlement",
  "road",
  "robber",
  "city",
];

function mapStateToProps(store: FoAppState) {
  return {
    playersByID: store.playersByID,
    currentPersonPlaying: store.currentPersonPlaying,
    inGamePlayerNumber: store.inGamePlayerNumber,
    isCurrentlyPlacingSettlement: store.isCurrentlyPlacingSettlement,
    isCurrentlyPlacingRoad: store.isCurrentlyPlacingRoad,
    isCurrentlyPlacingRobber: store.isCurrentlyPlacingRobber,
    isCurrentlyPlacingCity: store.isCurrentlyPlacingCity,
    boardToBePlayed: store.boardToBePlayed,
    robberCoordinates: store.robberCoordinates,
    turnNumber: store.turnNumber,
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
      isCurrentlyPlacingCity,
    } = this.props;

    if (isCurrentlyPlacingRoad) {
      return this.makeRoadHighlights();
    } else if (isCurrentlyPlacingSettlement) {
      return this.makeHighlightSet();
    } else if (isCurrentlyPlacingRobber) {
      return this.makeRobberHighlights();
    } else if (isCurrentlyPlacingCity) {
      return this.makeCityHighlights();
    } else {
      return null;
    }
  }

  makeCityHighlights() {
    const { inGamePlayerNumber, playersByID } = this.props;

    const currPlayer = playersByID.get(inGamePlayerNumber);

    if (currPlayer !== undefined) {
      let arr = [];
      let key = 0;

      for (const build of currPlayer.buildings) {
        if (build.typeOfBuilding === "settlement") {
          arr.push(
            <HighlightPoint
              key={key++}
              typeOfHighlight={"city"}
              boardXPos={build.boardXPos}
              boardYPos={build.boardYPos}
              corner={build.corner}
              playerWhoSelected={inGamePlayerNumber}
            />
          );
        }
      }

      return arr;
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
    // return [];

    let key = 0;
    let arr = [];
    for (const currTile of boardToBePlayed.listOfTiles) {
      if (
        currTile.point.boardXPos !== robberCoordinates.boardXPos ||
        currTile.point.boardYPos !== robberCoordinates.boardYPos
      ) {
        arr.push(
          <HighlightPoint
            key={key++}
            typeOfHighlight={"robber"}
            boardXPos={currTile.point.boardXPos}
            boardYPos={currTile.point.boardYPos}
            corner={-1}
            playerWhoSelected={inGamePlayerNumber}
          />
        );
      }
    }

    return arr;
  }

  makeRoadHighlights() {
    const { playersByID, inGamePlayerNumber, turnNumber } = this.props;

    let arr = [];
    let key = 0;

    // Can only place roads near your settlements
    const currPlayer = playersByID.get(inGamePlayerNumber);

    if (currPlayer !== undefined) {
      for (const build of currPlayer.buildings) {
        if (turnNumber === 2 && build.turnPlaced !== 2) {
          continue;
        }

        const equiv = getEquivPoints(build);
        for (const currPoint of equiv) {
          const pointAsRoad = {
            boardXPos: currPoint.boardXPos,
            boardYPos: currPoint.boardYPos,
            hexEdgeNumber: currPoint.corner,
          };

          if (!roadSpaceIsOccupied(pointAsRoad, playersByID)) {
            arr.push(
              <HighlightPoint
                key={key++}
                boardXPos={currPoint.boardXPos}
                boardYPos={currPoint.boardYPos}
                corner={currPoint.corner}
                playerWhoSelected={inGamePlayerNumber}
                typeOfHighlight={"road"}
              />
            );
          }
        }
      }

      if (turnNumber > 2) {
        for (const currRoad of currPlayer.roads) {
          const closeSpots = getOneAwayRoadSpots(currRoad);
          for (const currSpot of closeSpots) {
            if (
              !roadSpaceIsOccupied(currSpot, playersByID) &&
              pointIsInBounds(
                new BoardPoint(currSpot.boardXPos, currSpot.boardYPos)
              )
            ) {
              arr.push(
                <HighlightPoint
                  key={key++}
                  boardXPos={currSpot.boardXPos}
                  boardYPos={currSpot.boardYPos}
                  corner={currSpot.hexEdgeNumber}
                  playerWhoSelected={inGamePlayerNumber}
                  typeOfHighlight={"road"}
                />
              );
            }
          }
        }
      }
    }

    return arr;
  }

  // TODO: rename for settlements
  makeHighlightSet() {
    const {
      playersByID,
      currentPersonPlaying,
      inGamePlayerNumber,
      isCurrentlyPlacingSettlement,
      boardToBePlayed,
      turnNumber,
    } = this.props;

    const isTurn = currentPersonPlaying === inGamePlayerNumber;

    if (isTurn && isCurrentlyPlacingSettlement) {
      const spots = [];
      let keyForHighlights = 0;
      if (turnNumber <= 2) {
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
              for (const pl of playersByID.values()) {
                for (const setl of pl.buildings) {
                  const p1 = { boardXPos: x, boardYPos: y, corner };
                  const p2 = {
                    boardXPos: setl.boardXPos,
                    boardYPos: setl.boardYPos,
                    corner: setl.corner,
                  };

                  if (
                    areSamePoints(p1, p2, boardToBePlayed.listOfTiles) ||
                    pointsAreOneApart(p1, p2)
                  ) {
                    continue cornerLoop;
                  }
                }
              }

              spots.push(
                <HighlightPoint
                  key={keyForHighlights++}
                  boardXPos={x}
                  boardYPos={y}
                  corner={corner}
                  playerWhoSelected={inGamePlayerNumber}
                  typeOfHighlight={"settlement"}
                />
              );
            }

            numRowsDone++;
          }
        }
      } else {
        const currPlayer = playersByID.get(inGamePlayerNumber);
        if (currPlayer !== undefined) {
          for (const road of currPlayer.roads) {
            const nearbyBuildingSpots = roadPointToTouchingBuildingPoints(road);
            console.log(nearbyBuildingSpots);
            for (const buildingSpot of nearbyBuildingSpots) {
              if (
                canPutBuildingOn(
                  buildingSpot,
                  playersByID,
                  boardToBePlayed.listOfTiles
                )
              ) {
                console.log(buildingSpot);
                spots.push(
                  <HighlightPoint
                    key={keyForHighlights++}
                    boardXPos={buildingSpot.boardXPos}
                    boardYPos={buildingSpot.boardYPos}
                    corner={buildingSpot.corner}
                    playerWhoSelected={inGamePlayerNumber}
                    typeOfHighlight={"settlement"}
                  />
                );
              }
            }
          }
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
