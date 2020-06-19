import {
  faHorse,
  faBreadSlice,
  faGem,
  faGripVertical,
  faTree,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { PlayerNumber } from "../../types/Primitives";

// Tile colors
export const WHEAT = "#fec40d";
export const BRICK = "firebrick";
export const SHEEP = "gainsboro";
export const ORE = "grey";
export const WOOD = "green";
// export const WOOD = "#8B4513";

export const colorMap: { [index: string]: string } = {
  wood: WOOD,
  brick: BRICK,
  wheat: WHEAT,
  sheep: SHEEP,
  ore: ORE,
};

export const resMap: { [index: string]: IconDefinition } = {
  sheep: faHorse,
  wheat: faBreadSlice,
  ore: faGem,
  brick: faGripVertical,
  wood: faTree,
};

// Alt tiles
export const DARK_WHEAT = "#ffc400";

// General colors
export const WHITE = "#ffffff";

// Random
export const SAND = "#ffe39f";

// Blue red orange white
export const PLAYER_COLORS: Map<PlayerNumber, string> = new Map([
  [1, "#1569C7"],
  [2, "#e91d26"],
  [3, "#fb8c23"],
  [4, "white"],
]);
