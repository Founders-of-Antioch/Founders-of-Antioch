import { FoAppState } from "../redux/reducers/reducers";
import { isPlacingRoad, buyRoad } from "../redux/Actions";
import { Player } from "../entities/Player";
import { connect, ConnectedProps } from "react-redux";
import ActionButtonSet from "../components/ActionButtonSet";
import { Dispatch, bindActionCreators } from "redux";
import { PlayerNumber } from "../../../types/Primitives";

type ActionButtonSetProps = {
  playersByID: Map<PlayerNumber, Player>;
  inGamePlayerNumber: PlayerNumber;
  currentPersonPlaying: PlayerNumber;
  hasRolled: boolean;
  turnNumber: number;
};

function mapStateToProps(store: FoAppState): ActionButtonSetProps {
  return {
    playersByID: store.playersByID,
    inGamePlayerNumber: store.inGamePlayerNumber,
    currentPersonPlaying: store.currentPersonPlaying,
    hasRolled: store.hasRolled,
    turnNumber: store.turnNumber,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      isPlacingRoad,
      buyRoad,
    },
    dispatch
  );
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ABSProps = ConnectedProps<typeof connector>;

export default connector(ActionButtonSet);
