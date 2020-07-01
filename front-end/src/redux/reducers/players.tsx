import {
  PlayerAction,
  PLACE_BUILDING,
  PLACE_ROAD,
  COLLECT_RESOURCES,
  CHANGE_RESOURCE,
  GET_TOP_DEV_CARD,
  REMOVE_DEV_CARD,
  CLAIM_MONOPOLY,
  STEAL_FROM,
  PLAY_KNIGHT_CARD,
} from "../Actions";
import { Player } from "../../entities/Player";
import { PlayerNumber } from "../../../../types/Primitives";
import DevCard from "../../entities/DevCard";

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
    case PLACE_BUILDING:
      // TODO: Separate this copying player logic into another method
      const play = new Player(action.buildToAdd.playerNum);
      const playerFromState = state.get(action.buildToAdd.playerNum);

      if (playerFromState) {
        play.copyFromPlayer(playerFromState);

        if (action.buildToAdd.typeOfBuilding === "city") {
          for (const build of play.buildings) {
            if (build.spacesAreSame(action.buildToAdd)) {
              // Upgrade from settlement to city
              console.log("here");
              build.typeOfBuilding = "city";
            }
          }
        } else {
          play.buildings.push(action.buildToAdd);
        }

        // If it's a city of settlement, it will only go up by one
        // because cities are upgrades
        play.victoryPoints += 1;

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

        // console.log(newPl.contiguousRoads());

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
              if (
                action.robber.boardXPos !== currTile.point.boardXPos ||
                action.robber.boardYPos !== currTile.point.boardYPos
              ) {
                targetPlayer.addResource(currTile.resource);
                if (currBuilding.typeOfBuilding === "city") {
                  // Twice if it's a city
                  targetPlayer.addResource(currTile.resource);
                }
              }
            }
          }
        }

        newPlayersMap.set(targetPlayer.playerNum, targetPlayer);
      }

      return newPlayersMap;
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
    case GET_TOP_DEV_CARD:
      const getDCardPlayer = state.get(action.playerNumber);
      const newDevCardPlayer = new Player(action.playerNumber);

      if (getDCardPlayer !== undefined) {
        newDevCardPlayer.copyFromPlayer(getDCardPlayer);

        newDevCardPlayer.devCardHand.push(new DevCard(action.cardCode));

        return new Map([...state, [action.playerNumber, newDevCardPlayer]]);
      } else {
        console.log("Error player not found for dev card");
        return state;
      }
    case REMOVE_DEV_CARD:
      const getCardPlayer = state.get(action.playerNumber);
      const newCardPlayer = new Player(action.playerNumber);

      if (getCardPlayer !== undefined) {
        newCardPlayer.copyFromPlayer(getCardPlayer);
        newCardPlayer.devCardHand = newCardPlayer.devCardHand.filter(
          (val, idx) => {
            return idx !== action.handIndex;
          }
        );

        return new Map([...state, [action.playerNumber, newCardPlayer]]);
      } else {
        return state;
      }
    case CLAIM_MONOPOLY:
      const listOfPlayerNumbers: Array<PlayerNumber> = [1, 2, 3, 4];
      // Kinda fell on the TypeScript sword here
      const resToGain = [...state.keys()].reduce((acc: number, currKey) => {
        if (currKey !== action.playerNumber) {
          const currPl = state.get(currKey);
          if (currPl !== undefined) {
            const getVal = currPl.resourceHand.get(action.resource);
            if (getVal !== undefined) {
              return acc + getVal;
            } else {
              return acc;
            }
          } else {
            return acc;
          }
        } else {
          return acc;
        }
      }, 0);

      let newMonopolyMap = new Map<PlayerNumber, Player>();
      for (const currPNum of listOfPlayerNumbers) {
        const newMonoPlayer = new Player(currPNum);
        const getMonoPlayer = state.get(currPNum);

        if (getMonoPlayer !== undefined) {
          newMonoPlayer.copyFromPlayer(getMonoPlayer);

          if (currPNum === action.playerNumber) {
            const currResVal = newMonoPlayer.resourceHand.get(action.resource);
            if (currResVal !== undefined) {
              newMonoPlayer.resourceHand.set(
                action.resource,
                currResVal + resToGain
              );
            }
          } else {
            newMonoPlayer.resourceHand.set(action.resource, 0);
          }
        }

        newMonopolyMap.set(currPNum, newMonoPlayer);
      }

      return newMonopolyMap;
    case STEAL_FROM:
      const stealer = state.get(action.stealer);
      const stealee = state.get(action.stealee);

      if (stealer !== undefined && stealee !== undefined) {
        const newStealer = new Player(stealer.playerNum);
        const newStealee = new Player(stealee.playerNum);

        newStealer.copyFromPlayer(stealer);
        newStealee.copyFromPlayer(stealee);

        if (newStealee.numberOfCardsInHand() !== 0) {
          newStealee.stealResource(action.resource);

          const currStealVal = newStealer.resourceHand.get(action.resource);
          if (currStealVal !== undefined) {
            newStealer.resourceHand.set(action.resource, currStealVal + 1);
          }
        }

        return new Map([
          ...state,
          [action.stealer, newStealer],
          [action.stealee, newStealee],
        ]);
      } else {
        return state;
      }
    case PLAY_KNIGHT_CARD:
      const getKnightPlayer = state.get(action.player);
      const newKnightPlayer = new Player(action.player);

      if (getKnightPlayer !== undefined) {
        newKnightPlayer.copyFromPlayer(getKnightPlayer);

        newKnightPlayer.knights++;
        let newKnightsMap = new Map([
          ...state,
          [action.player, newKnightPlayer],
        ]);

        let LAClaimed = false;
        for (const currPlayNum of newKnightsMap.keys()) {
          const currPlayer = newKnightsMap.get(currPlayNum);

          if (currPlayer !== undefined && currPlayer.hasLargestArmy) {
            LAClaimed = true;
            break;
          }
        }

        if (LAClaimed) {
          for (const currPlayNum of newKnightsMap.keys()) {
            const currPlayer = newKnightsMap.get(currPlayNum);

            if (currPlayer !== undefined && currPlayer.hasLargestArmy) {
              if (newKnightPlayer.knights > currPlayer.knights) {
                newKnightPlayer.takeLargestArmy();
                newKnightsMap.set(newKnightPlayer.playerNum, newKnightPlayer);

                const losePlayer = newKnightsMap.get(currPlayer.playerNum);
                if (losePlayer !== undefined) {
                  const newLosePlayer = new Player(losePlayer.playerNum);
                  newLosePlayer.copyFromPlayer(losePlayer);
                  newLosePlayer.loseLargestArmy();
                  newKnightsMap.set(losePlayer.playerNum, newLosePlayer);
                }
              } else {
                break;
              }
            }
          }
        } else if (newKnightPlayer.knights >= 3) {
          newKnightPlayer.takeLargestArmy();

          newKnightsMap.set(newKnightPlayer.playerNum, newKnightPlayer);
        }

        return new Map([...newKnightsMap]);
      } else {
        return state;
      }
    default:
      return state;
  }
}
