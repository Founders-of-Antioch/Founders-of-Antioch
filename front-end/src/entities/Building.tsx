import { TileModel } from "./TileModel";
import { PlayerNumber } from "../../../types/Primitives";
import { BuildingProperties } from "../../../types/entities/Building";
import { tilesPointIsOn } from "./TilePointHelper";

export class Building implements BuildingProperties {
  boardXPos: number;
  boardYPos: number;
  corner: number;
  playerNum: PlayerNumber;
  touchingTiles: Array<TileModel>;
  turnPlaced: number;
  typeOfBuilding: "settlement" | "city";

  // Returns an array of TileModel representing the resources the building touches
  private tilesBuildingIsOn() {
    const { boardXPos, boardYPos, corner } = this;
    // return tilesPointIsOn(listOfTiles, { boardXPos, boardYPos, corner });
    return tilesPointIsOn({ boardXPos, boardYPos, corner });
  }

  constructor(
    bX: number,
    bY: number,
    corn: number,
    playerNum: PlayerNumber,
    turnPlaced: number,
    typeOfBuilding: "settlement" | "city"
  ) {
    this.boardXPos = bX;
    this.boardYPos = bY;
    this.corner = corn;
    this.playerNum = playerNum;
    this.touchingTiles = this.tilesBuildingIsOn();
    this.turnPlaced = turnPlaced;
    this.typeOfBuilding = typeOfBuilding;
  }

  spacesAreSame(b: Building) {
    return (
      this.boardXPos === b.boardXPos &&
      this.boardYPos === b.boardYPos &&
      this.corner === b.corner
    );
  }
}
