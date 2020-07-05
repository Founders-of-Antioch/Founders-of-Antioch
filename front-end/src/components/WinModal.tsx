import React, { Component } from "react";
import { Modal } from "semantic-ui-react";
import { FoAppState } from "../redux/reducers/reducers";
import { connect, ConnectedProps } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { WHEAT } from "../colors";

function mapStateToProps(store: FoAppState) {
  return {
    winner: store.winner,
    inGPNUM: store.inGamePlayerNumber,
  };
}

const connector = connect(mapStateToProps);

type WinProps = ConnectedProps<typeof connector>;

class WinModal extends Component<WinProps, {}> {
  render() {
    const { winner, inGPNUM } = this.props;
    const isWinner = winner === inGPNUM;

    return (
      <Modal open={winner !== -1} style={{ textAlign: "center" }}>
        <Modal.Header>
          {isWinner ? "You Win" : `Player ${winner} Wins`}!
        </Modal.Header>
        {isWinner ? (
          <Modal.Content>
            <FontAwesomeIcon icon={faTrophy} color={WHEAT} size="9x" />
          </Modal.Content>
        ) : null}
      </Modal>
    );
  }
}

export default connector(WinModal);
