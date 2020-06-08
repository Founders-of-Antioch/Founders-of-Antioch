// Action types
export const ROLLED_DICE = "ROLLED_DICE";
export const CHANGE_PLAYER = "CHANGE_PLAYER";
export const PLACE_SETTLEMENT = "PLACE_SETTLEMENT";
export const DECLARE_PLAYER_NUM = "DECLARE_PLAYER_NUM";

export interface RolledDiceAction {
  type: typeof ROLLED_DICE;
  diceOne: number;
  diceTwo: number;
}

export interface ChangePlayerAction {
  type: typeof CHANGE_PLAYER;
  playerNum: PlayerNumber;
}

// -1 For when the have not joined yet and are waiting for the backend
export type PlayerNumber = 1 | 2 | 3 | 4 | -1;

interface PlaceSettlementAction {
  type: typeof PLACE_SETTLEMENT;
  boardXPos: number;
  boardYPos: number;
  corner: number;
  playerNum: PlayerNumber;
}

export type PlayerAction = PlaceSettlementAction;

export interface DeclarePlayerNumAction {
  type: typeof DECLARE_PLAYER_NUM;
  declaredPlayerNum: PlayerNumber;
}

/** Action creators */
export function rolledDice(diceOne: number, diceTwo: number) {
  return { type: ROLLED_DICE, diceOne, diceTwo };
}

export function changePlayer(playerNum: PlayerNumber): ChangePlayerAction {
  return { type: CHANGE_PLAYER, playerNum };
}

export function placeSettlement(
  boardXPos: number,
  boardYPos: number,
  corner: number,
  playerNum: PlayerNumber
): PlaceSettlementAction {
  return { type: PLACE_SETTLEMENT, boardXPos, boardYPos, corner, playerNum };
}

export function declarePlayerNumber(
  inGameNum: PlayerNumber
): DeclarePlayerNumAction {
  return { type: DECLARE_PLAYER_NUM, declaredPlayerNum: inGameNum };
}

// export type FoActionTypes = ChangePlayerAction | PlaceSettlementAction;
