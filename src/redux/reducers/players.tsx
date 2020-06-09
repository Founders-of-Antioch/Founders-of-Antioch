import {
  PlayerNumber,
  PlayerAction,
  PLACE_SETTLEMENT,
  PLACE_ROAD,
  COLLECT_RESOURCES,
} from "../Actions";
import { Player } from "../../entities/Player";
import { Building } from "../../entities/Building";

export default function players(
  state: Map<PlayerNumber, Player> = new Map([
    [1, new Player(1)],
    [2, new Player(2)],
    [3, new Player(3)],
    [4, new Player(4)],
  ]),
  action: PlayerAction
): Map<PlayerNumber, Player> {
  switch (action.type) {
    case PLACE_SETTLEMENT:
      const build = new Building(
        action.boardXPos,
        action.boardYPos,
        action.corner,
        action.playerNum
      );
      // TODO: Separate this copying player logic into another method
      const play = new Player(action.playerNum);
      const playerFromState = state.get(action.playerNum);

      if (playerFromState) {
        play.copyFromPlayer(playerFromState);
        play.buildings.push(build);
        play.victoryPoints++;

        return new Map([...state, [action.playerNum, play]]);
      } else {
        console.log(`Player ${action.playerNum} not found`);
        return state;
      }
    case PLACE_ROAD:
      const newPl = new Player(action.road.playerNum);
      const pFromState = state.get(action.road.playerNum);

      if (pFromState) {
        newPl.copyFromPlayer(pFromState);
        newPl.roads.push(action.road);

        return new Map([...state, [action.road.playerNum, newPl]]);
      } else {
        console.log(`Player ${action.road.playerNum} not found`);
        return state;
      }
    case COLLECT_RESOURCES:
      const generPl = new Player(action.playerNumber);
      const pFState = state.get(action.playerNumber);
      console.log("Inside the reducer");

      if (pFState) {
        generPl.copyFromPlayer(pFState);
        for (const currRes of action.collectResources) {
          const currAmount = generPl.resourceHand.get(currRes);
          if (currAmount !== undefined) {
            generPl.resourceHand.set(currRes, currAmount + 1);
          }
        }
        console.log("Returning from reducer");
        return new Map([...state, [action.playerNumber, generPl]]);
      } else {
        console.log(`Player ${action.playerNumber} not found`);
        return state;
      }

    default:
      return state;
  }
}