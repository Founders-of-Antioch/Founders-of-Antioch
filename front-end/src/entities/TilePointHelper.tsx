import { TileModel } from "./TileModel";
import { PlayerNumber } from "../../../types/Primitives";
import { Player } from "./Player";
import BoardPoint from "./Points/BoardPoint";
import TilePoint from "./Points/TilePoint";
import RoadPoint from "./Points/RoadPoint";
import BuildingPoint from "./Points/BuildingPoint";

// https://www.redblobgames.com/grids/hexagons/#neighbors
export const NEIGHBOR_DIRECTIONS = [
  [1, 1],
  [1, 0],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [0, 1],
];

// TODO: refactor some of the garbo
export function pointIsInBounds(currPoint: BoardPoint) {
  if (currPoint.boardXPos === 0) {
    return !(Math.abs(currPoint.boardYPos) > 2);
  } else if (Math.abs(currPoint.boardXPos) === 2) {
    if (currPoint.boardXPos === 2) {
      return !(currPoint.boardYPos > 2) && !(currPoint.boardYPos < 0);
    } else {
      // times * sign
      return !(currPoint.boardYPos < -2) && !(currPoint.boardYPos > 0);
    }
  } else if (Math.abs(currPoint.boardXPos) === 1) {
    if (currPoint.boardXPos === 1) {
      return currPoint.boardYPos > -2 && currPoint.boardYPos < 3;
    } else {
      return currPoint.boardYPos < 2 && currPoint.boardYPos > -3;
    }
  } else {
    return false;
  }
}

// Include OB is for out of bounds
function tilesPointIsOnGeneral(
  listOfTiles: Array<TileModel>,
  point: TilePoint,
  includeOB: boolean
) {
  let adjTiles: Array<TileModel> = [];

  // This filters out checking for any tiles that are not touching the building
  const directions = [...NEIGHBOR_DIRECTIONS].filter((el, idx) => {
    const checkOne = point.positionOnTile;
    let checkTwo = checkOne - 1;
    if (checkTwo === -1) {
      checkTwo = 5;
    }

    return idx === checkOne || idx === checkTwo;
  });
  // Count the tile it is on as well
  directions.push([0, 0]);

  for (const currDirection of directions) {
    const expecX = currDirection[0] + point.boardPoint.boardXPos;
    const expecY = currDirection[1] + point.boardPoint.boardYPos;
    const expecPoint = new BoardPoint(expecX, expecY);

    if (includeOB) {
      // If it's for out of bounds checking, we don't care about anything
      // but the coordinates
      const newTile = new TileModel("desert", -1, expecX, expecY);
      adjTiles.push(newTile);
    } else {
      for (const currTile of listOfTiles) {
        if (currTile.point.equals(expecPoint)) {
          adjTiles.push(currTile);
        }
      }
    }
  }

  return adjTiles;
}

export function tilesPointIsOn(tiles: Array<TileModel>, point: TilePoint) {
  const gen = tilesPointIsOnGeneral(tiles, point, false);

  return gen.filter((currTile) => {
    return pointIsInBounds(currTile.point);
  });
}

// Like tilesPointIsOn, but includes tiles that are out of bounds
// Really only used in this file in checking if points are one away
function tilesPointIsOnWithOB(point: TilePoint) {
  return tilesPointIsOnGeneral([], point, true);
}

function p2IsLeftOfP1(p1: TilePoint, p2: TilePoint) {
  const deltaX = p2.boardPoint.boardXPos - p1.boardPoint.boardXPos;
  const deltaY = p2.boardPoint.boardYPos - p1.boardPoint.boardYPos;

  const leftDeltaArr = [
    [0, 1],
    [1, 1],
    [1, 0],
    [0, -1],
    [-1, -1],
    [-1, 0],
  ];

  const delt = leftDeltaArr[p1.positionOnTile];
  return deltaX === delt[0] && deltaY === delt[1];
}

function areSamePointsGeneral(
  p1: TilePoint,
  p2: TilePoint,
  inbounds: boolean,
  tiles: Array<TileModel>
) {
  const p1TouchingTiles = inbounds
    ? tilesPointIsOn(tiles, p1)
    : tilesPointIsOnWithOB(p1);

  // Indexing returns the corner that is the equivalent if
  // the tile is to the left of p1's corner
  const leftMap = [2, 3, 4, 5, 0, 1];
  const rightMap = [4, 5, 0, 1, 2, 3];

  for (const currTile of p1TouchingTiles) {
    if (currTile.point.equals(p2.boardPoint)) {
      if (p2.boardPoint.equals(p1.boardPoint)) {
        return p2.positionOnTile === p1.positionOnTile;
      } else {
        if (p2IsLeftOfP1(p1, p2)) {
          return p2.positionOnTile === leftMap[p1.positionOnTile];
        } else {
          return p2.positionOnTile === rightMap[p1.positionOnTile];
        }
      }
    }
  }

  return false;
}

export function areSamePoints(
  p1: TilePoint,
  p2: TilePoint,
  tiles: Array<TileModel>
) {
  return areSamePointsGeneral(p1, p2, true, tiles);
}

export function areSamePointsWithOB(p1: TilePoint, p2: TilePoint) {
  return areSamePointsGeneral(p1, p2, false, []);
}

// Points are one away if they share two and only two tiles
// Have to include out of bound tiles for this property to work though
export function pointsAreOneApart(p1: TilePoint, p2: TilePoint) {
  const p1Tiles = tilesPointIsOnWithOB(p1);
  const p2Tiles = tilesPointIsOnWithOB(p2);

  let alike = 0;
  for (const currP1 of p1Tiles) {
    for (const currP2 of p2Tiles) {
      if (
        currP2.point.boardXPos === currP1.point.boardXPos &&
        currP2.point.boardYPos === currP1.point.boardYPos
      ) {
        alike++;
      }
    }
  }

  return alike === 2;
}

export function getEquivPoints(p1: TilePoint) {
  const edgeOutOfBoundsMap = [4, 5, 0, 1, 2, 3];

  let arr = [];
  const obTiles = tilesPointIsOnWithOB(p1);

  let numOutBoundTiles = 0;
  for (const tile of obTiles) {
    if (!pointIsInBounds(tile.point)) {
      numOutBoundTiles++;
    }
  }

  for (const currTile of obTiles) {
    for (let i = 0; i < 6; i++) {
      const p2 = new TilePoint(currTile.point, i);
      if (areSamePointsWithOB(p1, p2)) {
        if (numOutBoundTiles < 2) {
          arr.push(p2);
        } else if (
          pointIsInBounds(p2.boardPoint) ||
          i !== edgeOutOfBoundsMap[p1.positionOnTile]
        ) {
          arr.push(p2);
        }
      }
    }
  }

  return arr;
}

const roadEdgeMap = [3, 4, 5, 0, 1, 2];

export function getOneAwayRoadSpots(p1: RoadPoint) {
  let leftSameTile = p1.positionOnTile - 1;
  let rightSameTile = p1.positionOnTile + 1;

  if (leftSameTile < 0) {
    leftSameTile = 5;
  }
  if (rightSameTile > 5) {
    rightSameTile = 0;
  }

  const l1 = new RoadPoint(p1.boardPoint, leftSameTile);
  const r1 = new RoadPoint(p1.boardPoint, rightSameTile);

  const oppositeDirection = NEIGHBOR_DIRECTIONS[p1.positionOnTile];
  const oppositeTile = new BoardPoint(
    p1.boardPoint.boardXPos + oppositeDirection[0],
    p1.boardPoint.boardYPos + oppositeDirection[1]
  );
  const oppositeEdge = roadEdgeMap[p1.positionOnTile];

  let oppLeft = oppositeEdge - 1;
  let oppRight = oppositeEdge + 1;

  if (oppLeft < 0) {
    oppLeft = 5;
  }
  if (oppRight > 5) {
    oppRight = 0;
  }

  const l2 = new RoadPoint(oppositeTile, oppLeft);
  const r2 = new RoadPoint(oppositeTile, oppRight);

  return [l1, r1, l2, r2];
}

export function roadPointToTouchingBuildingPoints(r: RoadPoint) {
  if (r.positionOnTile === 5) {
    return [
      new BuildingPoint(r.boardPoint, r.positionOnTile),
      new BuildingPoint(r.boardPoint, 0),
    ];
  } else {
    return [
      new BuildingPoint(r.boardPoint, r.positionOnTile),
      new BuildingPoint(r.boardPoint, r.positionOnTile + 1),
    ];
  }
}

export function roadSpaceIsOccupied(
  roadPoint: RoadPoint,
  playersByID: Map<PlayerNumber, Player>
) {
  for (const currPlayer of playersByID.values()) {
    for (const road of currPlayer.roads) {
      if (road.point.equals(roadPoint)) {
        return true;
      }
    }
  }

  return false;
}

function buildingSpaceIsOccupied(
  buildPoint: BuildingPoint,
  playersByID: Map<PlayerNumber, Player>,
  listOfTiles: Array<TileModel>
) {
  for (const currPlayer of playersByID.values()) {
    for (const build of currPlayer.buildings) {
      if (areSamePoints(build.point, buildPoint, listOfTiles)) {
        return true;
      }
    }
  }

  return false;
}

export function canPutBuildingOn(
  buildPoint: TilePoint,
  playersByID: Map<PlayerNumber, Player>,
  listOfTiles: Array<TileModel>
) {
  for (const currPlayer of playersByID.values()) {
    for (const build of currPlayer.buildings) {
      if (pointsAreOneApart(build.point, buildPoint)) {
        return false;
      }
    }
  }

  return !buildingSpaceIsOccupied(buildPoint, playersByID, listOfTiles);
}
