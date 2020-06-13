import { FoAppState } from "../redux/reducers/reducers";
import {
  PlayerNumber,
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
} from "../redux/Actions";
import { Player } from "../entities/Player";
import { TileModel } from "../entities/TIleModel";
import { Dispatch, bindActionCreators } from "redux";
import { connect, ConnectedProps } from "react-redux";
import App from "../App";

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
  return bindActionCreators(
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
    },
    dispatch
  );
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export type AppProps = ConnectedProps<typeof connector>;

export default connector(App);
