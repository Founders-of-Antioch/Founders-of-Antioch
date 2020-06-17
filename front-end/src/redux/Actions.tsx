import { RoadModel } from "../entities/RoadModel";
import { TileModel } from "../entities/TIleModel";
import { Building } from "../entities/Building";
import { SeedState } from "./reducers/reducers";
import store from "./store";

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
export const IS_PLACING_ROAD = "IS_PLACING_ROAD";
export const EVALUATE_TURN = "EVALUATE_TURN";
export const BUY_ROAD = "BUY_ROAD";
// Changes the amount of resource in a player's hand
export const CHANGE_RESOURCE = "CHANGE_RESOURCE";

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

interface BuyRoadAction {
  type: typeof BUY_ROAD;
  playerNumber: PlayerNumber;
}

interface ChangeResourceAction {
  type: typeof CHANGE_RESOURCE;
  playerNumber: PlayerNumber;
  resource: ResourceString;
  amount: number;
}

export type PlayerAction =
  | PlaceSettlementAction
  | PlaceRoadAction
  | CollectResourcesAction
  | BuyRoadAction
  | ChangeResourceAction;

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

export interface EvaluateTurnAction {
  type: typeof EVALUATE_TURN;
  slice: {
    hasRolled: boolean;
    turnNumber: number;
    isCurrentlyPlacingRoad: boolean;
    isCurrentlyPlacingSettlement: boolean;
  };
}

export type AllEndTurnActions = EndTurnAction | EvaluateTurnAction;

export interface IsPlacingSettlementAction {
  type: typeof IS_PLACING_SETTLEMENT;
  isOrIsnt: boolean;
}

export interface IsPlacingRoadAction {
  type: typeof IS_PLACING_ROAD;
  isOrIsnt: boolean;
}

/** Action creators */
export function hasRolledTheDice(hasRolled: boolean): HasRolledAction {
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

export function evaluateTurn(): EvaluateTurnAction {
  // If you have an idea to fix this, please do =)
  const currState = store.getState();
  return {
    type: EVALUATE_TURN,
    slice: {
      hasRolled: currState.hasRolled,
      turnNumber: currState.turnNumber,
      isCurrentlyPlacingSettlement: currState.isCurrentlyPlacingSettlement,
      isCurrentlyPlacingRoad: currState.isCurrentlyPlacingRoad,
    },
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

export function isPlacingRoad(isOrIsnt: boolean): IsPlacingRoadAction {
  return {
    type: IS_PLACING_ROAD,
    isOrIsnt,
  };
}

export function buyRoad(playerNumber: PlayerNumber): BuyRoadAction {
  return {
    type: BUY_ROAD,
    playerNumber,
  };
}

export function changeResource(
  playerNumber: PlayerNumber,
  resource: ResourceString,
  amount: number
): ChangeResourceAction {
  return {
    type: CHANGE_RESOURCE,
    playerNumber,
    resource,
    amount,
  };
}

// export type FoActionTypes = ChangePlayerAction | PlaceSettlementAction;
