import { FoAppState } from "../redux/reducers/reducers";
import { PlayerNumber, isPlacingRoad } from "../redux/Actions";
import { Player } from "../entities/Player";
import { connect, ConnectedProps } from "react-redux";
import ActionButtonSet from "../components/ActionButtonSet";
import { Dispatch, bindActionCreators } from "redux";

type ActionButtonSetProps = {
  playersByID: Map<PlayerNumber, Player>;
  inGamePlayerNumber: PlayerNumber;
  currentPersonPlaying: PlayerNumber;
  hasRolled: boolean;
};

function mapStateToProps(store: FoAppState): ActionButtonSetProps {
  return {
    playersByID: store.playersByID,
    inGamePlayerNumber: store.inGamePlayerNumber,
    currentPersonPlaying: store.currentPersonPlaying,
    hasRolled: store.hasRolled,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      isPlacingRoad,
    },
    dispatch
  );
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ABSProps = ConnectedProps<typeof connector>;

export default connector(ActionButtonSet);
