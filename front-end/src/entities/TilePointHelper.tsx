import { TileModel } from "./TileModel";

// Include OB is for out of bounds
function tilesPointIsOnGeneral(
  listOfTiles: Array<TileModel>,
  point: {
    boardXPos: number;
    boardYPos: number;
    corner: number;
  },
  includeOB: boolean
) {
  let adjTiles: Array<TileModel> = [];
  // https://www.redblobgames.com/grids/hexagons/#neighbors
  let directions = [
    [1, 1],
    [1, 0],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [0, 1],
  ];

  // This filters out checking for any tiles that are not touching the building
  directions = directions.filter((el, idx) => {
    const checkOne = point.corner;
    let checkTwo = checkOne - 1;
    if (checkTwo === -1) {
      checkTwo = 5;
    }

    return idx === checkOne || idx === checkTwo;
  });
  // Count the tile it is on as well
  directions.push([0, 0]);

  for (const currDirection of directions) {
    const expecX = currDirection[0] + point.boardXPos;
    const expecY = currDirection[1] + point.boardYPos;

    if (includeOB) {
      // If it's for out of bounds checking, we don't care about anything
      // but the coordinates
      const newTile = new TileModel("desert", -1, expecX, expecY);
      adjTiles.push(newTile);
    } else {
      for (const currTile of listOfTiles) {
        if (currTile.boardXPos === expecX && currTile.boardYPos === expecY) {
          adjTiles.push(currTile);
        }
      }
    }
  }

  return adjTiles;
}

// Returns an array of TileModel representing the resources the building touches
export function tilesPointIsOn(
  listOfTiles: Array<TileModel>,
  point: {
    boardXPos: number;
    boardYPos: number;
    corner: number;
  }
) {
  return tilesPointIsOnGeneral(listOfTiles, point, false);
}

// Like tilesPointIsOn, but includes tiles that are out of bounds
// Really only used in this file in checking if points are one away
function tilesPointIsOnWithOB(point: {
  boardXPos: number;
  boardYPos: number;
  corner: number;
}) {
  return tilesPointIsOnGeneral([], point, true);
}

function p2IsLeftOfP1(
  p1: { boardXPos: number; boardYPos: number; corner: number },
  p2: { boardXPos: number; boardYPos: number; corner: number }
) {
  const deltaX = p2.boardXPos - p1.boardXPos;
  const deltaY = p2.boardYPos - p1.boardYPos;

  const leftDeltaArr = [
    [0, 1],
    [1, 1],
    [1, 0],
    [0, -1],
    [-1, -1],
    [-1, 0],
  ];

  const delt = leftDeltaArr[p1.corner];
  return deltaX === delt[0] && deltaY === delt[1];
}

export function areSamePoints(
  listOfTiles: Array<TileModel>,
  p1: { boardXPos: number; boardYPos: number; corner: number },
  p2: { boardXPos: number; boardYPos: number; corner: number }
) {
  const p1TouchingTiles = tilesPointIsOn(listOfTiles, p1);

  // Indexing returns the corner that is the equivalent if
  // the tile is to the left of p1's corner
  const leftMap = [2, 3, 4, 5, 0, 1];
  const rightMap = [4, 5, 0, 1, 2, 3];

  for (const currTile of p1TouchingTiles) {
    if (
      currTile.boardXPos === p2.boardXPos &&
      currTile.boardYPos === p2.boardYPos
    ) {
      if (p2.boardXPos === p1.boardXPos && p2.boardYPos === p1.boardYPos) {
        return p2.corner === p1.corner;
      } else {
        if (p2IsLeftOfP1(p1, p2)) {
          return p2.corner === leftMap[p1.corner];
        } else {
          return p2.corner === rightMap[p1.corner];
        }
      }
    }
  }

  return false;
}

// Points are one away if they share two and only two tiles
// Have to include out of bound tiles for this property to work though
export function pointsAreOneApart(
  p1: { boardXPos: number; boardYPos: number; corner: number },
  p2: { boardXPos: number; boardYPos: number; corner: number }
) {
  const p1Tiles = tilesPointIsOnWithOB(p1);
  const p2Tiles = tilesPointIsOnWithOB(p2);

  let alike = 0;
  for (const currP1 of p1Tiles) {
    for (const currP2 of p2Tiles) {
      if (
        currP2.boardXPos === currP1.boardXPos &&
        currP2.boardYPos === currP1.boardYPos
      ) {
        alike++;
      }
    }
  }

  return alike === 2;
}
