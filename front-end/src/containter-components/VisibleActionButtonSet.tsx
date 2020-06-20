import { FoAppState } from "../redux/reducers/reducers";
import { isPlacingRoad } from "../redux/Actions";
import { Player } from "../entities/Player";
import { connect, ConnectedProps } from "react-redux";
import ActionButtonSet from "../components/ActionButtonSet";
import { Dispatch, bindActionCreators } from "redux";
import { PlayerNumber, DevCardCode } from "../../../types/Primitives";
import DevCard from "../entities/DevCard";
import {
  ResourceChangePackage,
  AcquireDevCardPackage,
} from "../../../types/SocketPackages";
import { socket } from "../App";

type ActionButtonSetProps = {
  playersByID: Map<PlayerNumber, Player>;
  inGamePlayerNumber: PlayerNumber;
  currentPersonPlaying: PlayerNumber;
  hasRolled: boolean;
  turnNumber: number;
  devCardPile: Array<DevCard>;
};

function mapStateToProps(store: FoAppState): ActionButtonSetProps {
  return {
    playersByID: store.playersByID,
    inGamePlayerNumber: store.inGamePlayerNumber,
    currentPersonPlaying: store.currentPersonPlaying,
    hasRolled: store.hasRolled,
    turnNumber: store.turnNumber,
    devCardPile: store.devCards,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    ...bindActionCreators(
      {
        isPlacingRoad,
      },
      dispatch
    ),
    getCurrentPlayerADevelopmentCard: (p: PlayerNumber, c: DevCardCode) => {
      // TODO: Fix Game ID's
      const devPkg: ResourceChangePackage = {
        gameID: "1",
        resourceDeltaMap: { sheep: -1, ore: -1, wheat: -1 },
        playerNumber: p,
      };
      socket.emit("resourceChange", devPkg);

      const getDCPKG: AcquireDevCardPackage = {
        gameID: "1",
        code: c,
        playerNumber: p,
      };
      socket.emit("acquireDevelopmentCard", getDCPKG);
    },
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ABSProps = ConnectedProps<typeof connector>;

export default connector(ActionButtonSet);
