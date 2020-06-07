// Action types
export const ROLLED_DICE = "ROLLED_DICE";
export const CHANGE_PLAYER = "CHANGE_PLAYER";
export const PLACE_SETTLEMENT = "PLACE_SETTLEMENT";

export interface RolledDiceAction {
  type: typeof ROLLED_DICE;
  diceOne: number;
  diceTwo: number;
}

export interface ChangePlayerAction {
  type: typeof CHANGE_PLAYER;
  playerNum: number;
}

export type PlayerNumbers = 1 | 2 | 3 | 4;

interface PlaceSettlementAction {
  type: typeof PLACE_SETTLEMENT;
  boardXPos: number;
  boardYPos: number;
  corner: number;
  playerNum: PlayerNumbers;
}

export type PlayerAction = PlaceSettlementAction;

/** Action creators */
export function rolledDice(diceOne: number, diceTwo: number) {
  return { type: ROLLED_DICE, diceOne, diceTwo };
}

export function changePlayer(playerNum: number): ChangePlayerAction {
  return { type: CHANGE_PLAYER, playerNum };
}

export function placeSettlement(
  boardXPos: number,
  boardYPos: number,
  corner: number,
  playerNum: number
) {
  return { type: PLACE_SETTLEMENT, boardXPos, boardYPos, corner, playerNum };
}

// export type FoActionTypes = ChangePlayerAction | PlaceSettlementAction;
