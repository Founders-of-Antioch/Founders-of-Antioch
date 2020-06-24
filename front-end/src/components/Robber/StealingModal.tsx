import React, { Component } from "react";
import { Modal, Button } from "semantic-ui-react";
import { FoAppState } from "../../redux/reducers/reducers";
import { connect, ConnectedProps } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { declareStealingInfo } from "../../redux/Actions";
import { socket } from "../../App";
import { StealFromPackage } from "../../../../types/SocketPackages";
import { PlayerNumber } from "../../../../types/Primitives";

function mapStateToProps(store: FoAppState) {
  return {
    stealingInfo: store.stealingInfo,
    inGamePlayerNumber: store.inGamePlayerNumber,
    playersByID: store.playersByID,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({ declareStealingInfo }, dispatch);
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type StealingModalProps = ConnectedProps<typeof connector>;

class StealingModal extends Component<StealingModalProps, {}> {
  constructor(props: StealingModalProps) {
    super(props);

    this.selectPlayerToSteal = this.selectPlayerToSteal.bind(this);
  }

  selectPlayerToSteal(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { inGamePlayerNumber, playersByID } = this.props;

    const stealeeNum = Number(event.currentTarget.id.split("-")[1]);
    const stealee = playersByID.get(stealeeNum as PlayerNumber);

    let res = "-1";
    if (stealee !== undefined) {
      res = stealee.getRandomResource();
    }

    // TODO: Fix GameID
    const pkg: StealFromPackage = {
      gameID: "1",
      stealee: stealeeNum as PlayerNumber,
      stealer: inGamePlayerNumber,
      resource: res,
    };
    socket.emit("stealFrom", pkg);

    this.props.declareStealingInfo(false, []);
  }

  playerButtons() {
    let key = 0;
    let arr = [];

    for (const currPlayNum of this.props.stealingInfo.availableToSteal) {
      if (currPlayNum !== this.props.inGamePlayerNumber) {
        const currPlayer = this.props.playersByID.get(currPlayNum);
        if (currPlayer !== undefined) {
          const cardsInHand = currPlayer.numberOfCardsInHand();
          arr.push(
            <Button
              id={`stealfrom-${currPlayNum}`}
              onClick={this.selectPlayerToSteal}
              size={"large"}
              key={key++}
            >
              Player {currPlayNum}: {cardsInHand}{" "}
              {cardsInHand === 1 ? "card" : "cards"}
            </Button>
          );
        }
      }
    }

    return arr;
  }

  render() {
    return (
      <Modal open={this.props.stealingInfo.isStealing}>
        <Modal.Header>Choose a Player To Steal a Card From</Modal.Header>
        <Modal.Content style={{ textAlign: "center" }}>
          {this.playerButtons()}
        </Modal.Content>
      </Modal>
    );
  }
}

export default connector(StealingModal);
