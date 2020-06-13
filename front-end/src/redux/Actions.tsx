import { RoadModel } from "../entities/RoadModel";
import { TileModel } from "../entities/TIleModel";
import { Building } from "../entities/Building";
import { SeedState } from "./reducers/reducers";

// Action types
export const CHANGE_PLAYER = "CHANGE_PLAYER";
export const PLACE_SETTLEMENT = "PLACE_SETTLEMENT";
export const PLACE_ROAD = "PLACE_ROAD";
export const DECLARE_PLAYER_NUM = "DECLARE_PLAYER_NUM";
export const HAS_ROLLED = "HAS_ROLLED";
export const NEXT_TURN = "NEXT_TURN";
export const COLLECT_RESOURCES = "COLLECT_RESOURCES";
export const DECLARE_BOARD = "DECLARE_BOARD";
export const SET_SEED = "SET_SEED";
export const CAN_END_TURN = "CAN_END_TURN";
export const IS_PLACING_SETTLEMENT = "IS_PLACING_SETTLEMENT";

export interface ChangePlayerAction {
  type: typeof CHANGE_PLAYER;
  playerNum: PlayerNumber;
}

// -1 For when the have not joined yet and are waiting for the backend
export type PlayerNumber = 1 | 2 | 3 | 4 | -1;

export type ResourceString =
  | "desert"
  | "wood"
  | "brick"
  | "ore"
  | "sheep"
  | "wheat";

// TODO: Migrate to just take in 'Building' instead of 4 params
interface PlaceSettlementAction {
  type: typeof PLACE_SETTLEMENT;
  buildToAdd: Building;
}

interface PlaceRoadAction {
  type: typeof PLACE_ROAD;
  road: RoadModel;
}

interface CollectResourcesAction {
  type: typeof COLLECT_RESOURCES;
  diceSum: number;
}

export type PlayerAction =
  | PlaceSettlementAction
  | PlaceRoadAction
  | CollectResourcesAction;

export interface DeclarePlayerNumAction {
  type: typeof DECLARE_PLAYER_NUM;
  declaredPlayerNum: PlayerNumber;
}

export interface HasRolledAction {
  type: typeof HAS_ROLLED;
  hasRolled: boolean;
}

export interface NextTurnAction {
  type: typeof NEXT_TURN;
  turnNumber: number;
}

export interface DeclareBoardAction {
  type: typeof DECLARE_BOARD;
  board: { listOfTiles: Array<TileModel>; gameID: string };
}

export interface SetSeedAction {
  type: typeof SET_SEED;
  stateSeed: SeedState;
}

export interface EndTurnAction {
  type: typeof CAN_END_TURN;
  canOrCant: boolean;
}

export interface IsPlacingSettlementAction {
  type: typeof IS_PLACING_SETTLEMENT;
  isOrIsnt: boolean;
}

/** Action creators */
export function hasRolled(hasRolled: boolean): HasRolledAction {
  return { type: HAS_ROLLED, hasRolled };
}

export function changePlayer(playerNum: PlayerNumber): ChangePlayerAction {
  return { type: CHANGE_PLAYER, playerNum };
}

// NOTE: ONLY TO BE USED in Socket LISTNERS
// This is because once the backend knows there is a new
// building, it'll send a mass update to all players,
// including itself. So don't create double counts!
export function placeSettlement(buildToAdd: Building): PlaceSettlementAction {
  return { type: PLACE_SETTLEMENT, buildToAdd };
}

// NOTE: ONLY TO BE USED in Socket LISTNERS
// This is because once the backend knows there is a new
// building, it'll send a mass update to all players,
// including itself. So don't create double counts!
export function placeRoad(road: RoadModel): PlaceRoadAction {
  return { type: PLACE_ROAD, road };
}

export function declarePlayerNumber(
  inGameNum: PlayerNumber
): DeclarePlayerNumAction {
  return { type: DECLARE_PLAYER_NUM, declaredPlayerNum: inGameNum };
}

export function nextTurn(turnNumber: number): NextTurnAction {
  return { type: NEXT_TURN, turnNumber };
}

// NOTE: ONLY TO BE USED in Socket LISTNERS
// This is because once the backend knows what someone rolled,
// it'll send a mass update to all players,
// including itself. So don't create double counts!
export function collectResources(diceSum: number): CollectResourcesAction {
  return { type: COLLECT_RESOURCES, diceSum };
}

export function declareBoard(
  listOfTiles: Array<TileModel>,
  gameID: string
): DeclareBoardAction {
  return { type: DECLARE_BOARD, board: { listOfTiles, gameID } };
}

export function setSeed(stateSeed: SeedState): SetSeedAction {
  console.log(1234);
  return { type: SET_SEED, stateSeed };
}

export function possibleToEndTurn(canOrCant: boolean): EndTurnAction {
  return {
    type: CAN_END_TURN,
    canOrCant,
  };
}

export function isPlacingASettlement(
  isOrIsnt: boolean
): IsPlacingSettlementAction {
  return {
    type: IS_PLACING_SETTLEMENT,
    isOrIsnt,
  };
}

// export type FoActionTypes = ChangePlayerAction | PlaceSettlementAction;
