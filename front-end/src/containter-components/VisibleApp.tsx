import { FoAppState } from "../redux/reducers/reducers";
import {
  placeBuilding,
  placeRoad,
  declareBoard,
  declarePlayerNumber,
  possibleToEndTurn,
  isPlacingASettlement,
  isPlacingRoad,
  changePlayer,
  nextTurn,
  hasRolledTheDice,
  evaluateTurn,
  changeResource,
  declareDevelopmentCards,
  takeTopDevelopmentCardOff,
  acquireDevelopmentCard,
  playerHasPlayedDC,
  removeDevelopmentCardFromHand,
  claimMonopolyForPlayer,
  moveRobberTo,
  stealFromPlayer,
  playAKnightDevCard,
  evaluateWinState,
} from "../redux/Actions";
import { Player } from "../entities/Player";
import { TileModel } from "../entities/TileModel";
import { Dispatch, bindActionCreators } from "redux";
import { connect, ConnectedProps } from "react-redux";
import App from "../App";
import { PlayerNumber, DevCardCode } from "../../../types/Primitives";

type AppState = {
  listOfPlayers: Map<PlayerNumber, Player>;
  inGamePlayerNumber: PlayerNumber;
  boardToBePlayed: { listOfTiles: Array<TileModel>; gameID: string };
  currentPersonPlaying: PlayerNumber;
  canEndTurn: boolean;
  isCurrentlyPlacingSettlement: boolean;
  turnNumber: number;
  isCurrentlyPlacingRoad: boolean;
  hasRolled: boolean;
  isCurrentlyPlacingRobber: boolean;
};

function mapStateToProps(store: FoAppState): AppState {
  return {
    listOfPlayers: store.playersByID,
    inGamePlayerNumber: store.inGamePlayerNumber,
    boardToBePlayed: store.boardToBePlayed,
    currentPersonPlaying: store.currentPersonPlaying,
    canEndTurn: store.canEndTurn,
    isCurrentlyPlacingSettlement: store.isCurrentlyPlacingSettlement,
    turnNumber: store.turnNumber,
    isCurrentlyPlacingRoad: store.isCurrentlyPlacingRoad,
    hasRolled: store.hasRolled,
    isCurrentlyPlacingRobber: store.isCurrentlyPlacingRobber,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    ...bindActionCreators(
      {
        placeBuilding,
        placeRoad,
        declareBoard,
        declarePlayerNumber,
        possibleToEndTurn,
        isPlacingASettlement,
        isPlacingRoad,
        nextTurn,
        changePlayer,
        hasRolledTheDice,
        evaluateTurn,
        changeResource,
        declareDevelopmentCards,
        playerHasPlayedDC,
        removeDevelopmentCardFromHand,
        claimMonopolyForPlayer,
        moveRobberTo,
        stealFromPlayer,
        playAKnightDevCard,
        evaluateWinState,
      },
      dispatch
    ),
    getPlayerADevCard: (p: PlayerNumber, c: DevCardCode) => {
      dispatch(acquireDevelopmentCard(p, c));
      dispatch(takeTopDevelopmentCardOff());
    },
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export type AppProps = ConnectedProps<typeof connector>;

export default connector(App);
