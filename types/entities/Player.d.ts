import { PlayerNumber } from "../Primitives";
import { BuildingProperties } from "./Building";
import { RoadModelProperties } from "./RoadModel";
import DevCard from "../../front-end/src/entities/DevCard";

export interface PlayerProperties {
  playerNum: PlayerNumber;
  victoryPoints: number;
  buildings: Array<BuildingProperties>;
  roads: Array<RoadModelProperties>;
  knights: number;
  // TODO: Change key type to ResourceString
  resourceHand: Map<string, number>;
  devCardHand: Array<DevCard>;
}
