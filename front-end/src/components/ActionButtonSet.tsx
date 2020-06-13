import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { PlayerNumber } from "../redux/Actions";
import { Player } from "../entities/Player";
import { FoAppState } from "../redux/reducers/reducers";
import { connect, ConnectedProps } from "react-redux";

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

const connector = connect(mapStateToProps);

type ABSProps = ConnectedProps<typeof connector> & {
  buyRoadCB: Function;
};

class ActionButtonSet extends Component<ABSProps, {}> {
  getResAmount(res: string): number {
    const { playersByID, inGamePlayerNumber } = this.props;
    const currPlayer = playersByID.get(inGamePlayerNumber);

    if (currPlayer) {
      const currVal = currPlayer.resourceHand.get(res);
      if (currVal !== undefined) {
        return currVal;
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  }

  isTurn() {
    const { inGamePlayerNumber, currentPersonPlaying } = this.props;
    return inGamePlayerNumber === currentPersonPlaying;
  }

  canBuySettlement() {
    return (
      this.props.hasRolled &&
      this.isTurn() &&
      this.getResAmount("wood") >= 1 &&
      this.getResAmount("brick") >= 1 &&
      this.getResAmount("sheep") >= 1 &&
      this.getResAmount("wheat") >= 1
    );
  }

  canBuyCity() {
    return (
      this.props.hasRolled &&
      this.isTurn() &&
      this.getResAmount("ore") >= 3 &&
      this.getResAmount("wheat") >= 2
    );
  }

  canBuyRoad() {
    return (
      this.props.hasRolled &&
      this.isTurn() &&
      this.getResAmount("wood") >= 1 &&
      this.getResAmount("brick") >= 1
    );
  }

  canBuyDevCard() {
    return (
      this.props.hasRolled &&
      this.isTurn() &&
      this.getResAmount("sheep") >= 1 &&
      this.getResAmount("ore") >= 1 &&
      this.getResAmount("wheat") >= 1
    );
  }

  render() {
    return (
      <div
        style={{
          zIndex: 2,
          position: "absolute",
          right: "1%",
          bottom: "0%",
        }}
      >
        <Button.Group size="massive">
          <Button color="red" icon="home" disabled={!this.canBuySettlement()} />
          <Button
            color="yellow"
            icon="building"
            disabled={!this.canBuyCity()}
          />
          <Button
            color="red"
            icon="road"
            onClick={() => {
              this.props.buyRoadCB();
            }}
            disabled={!this.canBuyRoad()}
          />
          <Button color="yellow" icon="copy" disabled={!this.canBuyDevCard()} />
          <Button color="red" icon="handshake" disabled={!this.isTurn()} />
          <Button color="yellow" icon="info circle" />
        </Button.Group>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ActionButtonSet);
