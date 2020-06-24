import React, { Component } from "react";
import { Modal, Button } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LIST_OF_RESOURCES } from "../../entities/Player";
import { resIconMap, resColorMap } from "../../colors";
import { ResourceString, PlayerNumber } from "../../../../types/Primitives";
import { socket } from "../../App";
import { ClaimMonopolyPackage } from "../../../../types/SocketPackages";
import PlayCardButton from "./PlayCardButton";

type MonProps = {
  inGamePlayerNumber: PlayerNumber;
  discardDevCard: () => void;
};

type UIState = {
  showModal: boolean;
};

export default class MonopolySelection extends Component<MonProps, UIState> {
  constructor(props: MonProps) {
    super(props);

    this.state = {
      showModal: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({
      showModal: true,
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
    });
  }

  // TODO: Fix GameID
  monopolizeResources(res: ResourceString) {
    const pkg: ClaimMonopolyPackage = {
      gameID: "1",
      playerNumber: this.props.inGamePlayerNumber,
      resource: res,
    };

    socket.emit("claimMonopoly", pkg);
    this.props.discardDevCard();
    this.closeModal();
  }

  resourceButtons() {
    let key = 0;
    let arr = [];

    for (const res of LIST_OF_RESOURCES) {
      arr.push(
        <Button
          onClick={() => {
            this.monopolizeResources(res);
          }}
          key={key++}
        >
          <FontAwesomeIcon
            size="5x"
            style={res === "sheep" ? { stroke: "black", strokeWidth: 3 } : {}}
            color={resColorMap[res]}
            icon={resIconMap[res]}
          />
        </Button>
      );
    }

    return arr;
  }

  render() {
    return (
      <Modal
        open={this.state.showModal}
        trigger={<PlayCardButton openModalFunction={this.openModal} />}
      >
        <Modal.Header>
          Select a resource to steal from all other players
        </Modal.Header>
        <Modal.Content style={{ textAlign: "center" }}>
          <Button.Group>{this.resourceButtons()}</Button.Group>
        </Modal.Content>
      </Modal>
    );
  }
}
