import { RoadModel } from "../entities/RoadModel";
import { TileModel } from "../entities/TileModel";
import { Building } from "../entities/Building";
import { SeedState, RobberCoordinates } from "./reducers/reducers";
import {
  PlayerNumber,
  ResourceString,
  DevCardCode,
} from "../../../types/Primitives";
import store from "./store";
import DevCard from "../entities/DevCard";

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
// Changes the amount of resource in a player's hand
export const CHANGE_RESOURCE = "CHANGE_RESOURCE";
export const DECLARE_DEV_CARDS = "DELCARE_DEV_CARDS";
// Pops off the state list
export const TAKE_TOP_DEV_CARD = "TAKE_TOP_DEV_CARD";
// Puts it into the players hand
export const GET_TOP_DEV_CARD = "GET_TOP_DEV_CARD";
// Prevents playing more than one in a turn
export const HAS_PLAYED_DEV_CARD = "HAS_PLAYED_DEV_CARD";
// Remove card from player hand
export const REMOVE_DEV_CARD = "REMOVED_DEV_CARD";
export const CLAIM_MONOPOLY = "CLAIM_MONOPOLY";
export const IS_PLACING_ROBBER = "IS_PLACING_ROBBER";
export const MOVE_ROBBER = "MOVE_ROBBER";

export interface ChangePlayerAction {
  type: typeof CHANGE_PLAYER;
  playerNum: PlayerNumber;
}

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
  robber: RobberCoordinates;
}

interface ChangeResourceAction {
  type: typeof CHANGE_RESOURCE;
  playerNumber: PlayerNumber;
  resource: ResourceString;
  amount: number;
}

interface GetDevCardAction {
  type: typeof GET_TOP_DEV_CARD;
  playerNumber: PlayerNumber;
  cardCode: DevCardCode;
}

interface RemoveDevCardAction {
  type: typeof REMOVE_DEV_CARD;
  playerNumber: PlayerNumber;
  handIndex: number;
}

interface ClaimMonopolyAction {
  type: typeof CLAIM_MONOPOLY;
  playerNumber: PlayerNumber;
  resource: ResourceString;
}

export type PlayerAction =
  | PlaceSettlementAction
  | PlaceRoadAction
  | CollectResourcesAction
  | ChangeResourceAction
  | GetDevCardAction
  | RemoveDevCardAction
  | ClaimMonopolyAction;

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
    isCurrentlyPlacingRobber: boolean;
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

interface DeclareDevCardsAction {
  type: typeof DECLARE_DEV_CARDS;
  listOfCards: Array<DevCard>;
}

interface TakeTopDevCardAction {
  type: typeof TAKE_TOP_DEV_CARD;
}

export type DevCardActions = DeclareDevCardsAction | TakeTopDevCardAction;

export interface HasPlayedDevCardAction {
  type: typeof HAS_PLAYED_DEV_CARD;
  hasPlayed: boolean;
}

export interface IsPlacingRobberAction {
  type: typeof IS_PLACING_ROBBER;
  isPlacingRobber: boolean;
}

export interface MoveRobberAction {
  type: typeof MOVE_ROBBER;
  boardXPos: number;
  boardYPos: number;
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
  const currState = store.getState();
  return {
    type: COLLECT_RESOURCES,
    diceSum,
    robber: currState.robberCoordinates,
  };
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
      isCurrentlyPlacingRobber: currState.isCurrentlyPlacingRobber,
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

export function declareDevelopmentCards(
  listOfCards: Array<DevCard>
): DeclareDevCardsAction {
  return {
    type: DECLARE_DEV_CARDS,
    listOfCards,
  };
}

/**
 * NOTE: The next two action creators (dev card ones) should only be used
 * in the action button set when clicking on the dev card button
 *
 * This removes it from the state pile
 */
export function takeTopDevelopmentCardOff(): TakeTopDevCardAction {
  return {
    type: TAKE_TOP_DEV_CARD,
  };
}

/** SEE NOTE ^
 * This puts it in the players hand, should go first
 */
export function acquireDevelopmentCard(
  playerNumber: PlayerNumber,
  cardCode: DevCardCode
): GetDevCardAction {
  return {
    type: GET_TOP_DEV_CARD,
    playerNumber,
    cardCode,
  };
}

export function playerHasPlayedDC(hasPlayed: boolean): HasPlayedDevCardAction {
  return {
    type: HAS_PLAYED_DEV_CARD,
    hasPlayed,
  };
}

export function removeDevelopmentCardFromHand(
  playerNumber: PlayerNumber,
  handIndex: number
): RemoveDevCardAction {
  return {
    type: REMOVE_DEV_CARD,
    playerNumber,
    handIndex,
  };
}

export function claimMonopolyForPlayer(
  playerNumber: PlayerNumber,
  resource: ResourceString
): ClaimMonopolyAction {
  return {
    type: CLAIM_MONOPOLY,
    playerNumber,
    resource,
  };
}

export function playerIsPlacingRobber(
  isPlacingRobber: boolean
): IsPlacingRobberAction {
  return {
    type: IS_PLACING_ROBBER,
    isPlacingRobber,
  };
}

export function moveRobberTo(
  boardXPos: number,
  boardYPos: number
): MoveRobberAction {
  return {
    type: MOVE_ROBBER,
    boardXPos,
    boardYPos,
  };
}
