import { FoAppState } from "../redux/reducers/reducers";
import {
  placeSettlement,
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
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    ...bindActionCreators(
      {
        placeSettlement,
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
