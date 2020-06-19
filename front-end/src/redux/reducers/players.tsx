import {
  PlayerNumber,
  PlayerAction,
  PLACE_SETTLEMENT,
  PLACE_ROAD,
  COLLECT_RESOURCES,
  BUY_ROAD,
  CHANGE_RESOURCE,
} from "../Actions";
import { Player } from "../../entities/Player";

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
      // TODO: Separate this copying player logic into another method
      const play = new Player(action.buildToAdd.playerNum);
      const playerFromState = state.get(action.buildToAdd.playerNum);

      if (playerFromState) {
        play.copyFromPlayer(playerFromState);
        play.buildings.push(action.buildToAdd);
        play.victoryPoints++;

        return new Map([...state, [action.buildToAdd.playerNum, play]]);
      } else {
        console.log(`Player ${action.buildToAdd.playerNum} not found`);
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
      let newPlayersMap = new Map<PlayerNumber, Player>();
      for (const currPlayer of state.values()) {
        const targetPlayer = new Player(currPlayer.playerNum);
        targetPlayer.copyFromPlayer(currPlayer);

        for (const currBuilding of targetPlayer.buildings) {
          for (const currTile of currBuilding.touchingTiles) {
            if (action.diceSum === currTile.counter) {
              targetPlayer.addResource(currTile.resource);
            }
          }
        }

        newPlayersMap.set(targetPlayer.playerNum, targetPlayer);
      }

      return newPlayersMap;
    case BUY_ROAD:
      const buyRoadPlayer = new Player(action.playerNumber);
      const getPlayer = state.get(action.playerNumber);
      if (getPlayer !== undefined) {
        buyRoadPlayer.copyFromPlayer(getPlayer);

        const currWood = buyRoadPlayer.resourceHand.get("wood");
        const currBrick = buyRoadPlayer.resourceHand.get("brick");

        if (currWood !== undefined && currBrick !== undefined) {
          buyRoadPlayer.resourceHand.set("wood", currWood - 1);
          buyRoadPlayer.resourceHand.set("brick", currBrick - 1);

          return new Map([...state, [action.playerNumber, buyRoadPlayer]]);
        } else {
          console.log(
            "Something is really wrong! For some reason, the player doesn't have wood or brick"
          );
          return state;
        }
      } else {
        return state;
      }
    case CHANGE_RESOURCE:
      const changeResPlayer = new Player(action.playerNumber);
      const getResPlayer = state.get(action.playerNumber);

      if (getResPlayer !== undefined) {
        changeResPlayer.copyFromPlayer(getResPlayer);
        changeResPlayer.changeResourceVal(action.resource, action.amount);

        return new Map([...state, [action.playerNumber, changeResPlayer]]);
      } else {
        return state;
      }
    default:
      return state;
  }
}
