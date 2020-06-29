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
import BuildingPoint from "../../entities/Points/BuildingPoint";
import RoadPoint from "../../entities/Points/RoadPoint";
import TilePoint from "../../entities/Points/TilePoint";

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
              point={build.point}
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
            point={new TilePoint(currTile.point, -1)}
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

        const equiv = getEquivPoints(build.point);
        for (const currPoint of equiv) {
          if (
            !roadSpaceIsOccupied(
              new RoadPoint(currPoint.boardPoint, currPoint.positionOnTile),
              playersByID
            )
          ) {
            arr.push(
              <HighlightPoint
                key={key++}
                point={currPoint}
                playerWhoSelected={inGamePlayerNumber}
                typeOfHighlight={"road"}
              />
            );
          }
        }
      }
      if (turnNumber > 2) {
        for (const currRoad of currPlayer.roads) {
          const closeSpots = getOneAwayRoadSpots(currRoad.point);
          for (const currSpot of closeSpots) {
            if (
              !roadSpaceIsOccupied(currSpot, playersByID) &&
              pointIsInBounds(currSpot.boardPoint)
            ) {
              arr.push(
                <HighlightPoint
                  key={key++}
                  point={currSpot}
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
                  const p1 = new BuildingPoint(new BoardPoint(x, y), corner);
                  if (
                    areSamePoints(
                      p1,
                      setl.point,
                      boardToBePlayed.listOfTiles
                    ) ||
                    pointsAreOneApart(p1, setl.point)
                  ) {
                    continue cornerLoop;
                  }
                }
              }

              spots.push(
                <HighlightPoint
                  key={keyForHighlights++}
                  point={new BuildingPoint(new BoardPoint(x, y), corner)}
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
            const nearbyBuildingSpots = roadPointToTouchingBuildingPoints(
              road.point
            );
            for (const buildingSpot of nearbyBuildingSpots) {
              if (
                canPutBuildingOn(
                  buildingSpot,
                  playersByID,
                  boardToBePlayed.listOfTiles
                )
              ) {
                spots.push(
                  <HighlightPoint
                    key={keyForHighlights++}
                    point={buildingSpot}
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
