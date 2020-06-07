// Action types
export const ROLL_DICE = "ROLL_DICE";
export const CHANGE_PLAYER = "CHANGE_PLAYER";

export interface ChangePlayerAction {
  type: typeof CHANGE_PLAYER;
  playerNum: number;
}

// Action creators
export function rollDice(diceOne: number, diceTwo: number) {
  return { type: ROLL_DICE, diceOne, diceTwo };
}

export function changePlayer(playerNum: number): ChangePlayerAction {
  return { type: CHANGE_PLAYER, playerNum };
}

export type FoActionTypes = ChangePlayerAction;
