import React, { Component, ChangeEvent } from "react";
import { Modal, Button, FormGroup, Form } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resIconMap, resColorMap } from "../../colors";
import { ResourceString, PlayerNumber } from "../../../../types/Primitives";
import { LIST_OF_RESOURCES } from "../../entities/Player";
import { FoAppState } from "../../redux/reducers/reducers";
import { ConnectedProps, connect } from "react-redux";
import { socket } from "../../App";
import { ResourceChangePackage } from "../../../../types/SocketPackages";
import PlayCardButton from "./PlayCardButton";

type UIState = {
  currValues: Map<ResourceString, number>;
  modalOpen: boolean;
};

type YOPProps = {
  inGamePlayerNumber: PlayerNumber;
};

function mapStateToProps(store: FoAppState): YOPProps {
  return {
    inGamePlayerNumber: store.inGamePlayerNumber,
  };
}

const connector = connect(mapStateToProps);

type YearProps = ConnectedProps<typeof connector> & {
  discardDevCard: () => void;
};

class YOPSelection extends Component<YearProps, UIState> {
  constructor(props: YearProps) {
    super(props);

    let emptyResMap = new Map<ResourceString, number>();
    for (const currRes of LIST_OF_RESOURCES) {
      emptyResMap.set(currRes, 0);
    }

    this.state = {
      currValues: emptyResMap,
      modalOpen: false,
    };

    this.setNumRes = this.setNumRes.bind(this);
    this.absoluteNumberofResources = this.absoluteNumberofResources.bind(this);
    this.confirm = this.confirm.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  setNumRes(e: ChangeEvent<HTMLInputElement>) {
    const res = e.target.id.split("-")[0] as ResourceString;
    if (res !== undefined) {
      const { currValues } = this.state;
      const nextMap = new Map([...currValues]);
      nextMap.set(res, Number(e.target.value));

      this.setState({ currValues: nextMap });
    }
  }

  absoluteNumberofResources() {
    const { currValues } = this.state;

    let sum = 0;
    for (const currKey of currValues.keys()) {
      const val = currValues.get(currKey);
      if (val !== undefined) {
        sum += Math.abs(val);
      }
    }

    return sum;
  }

  renderInputs() {
    let arr = [];
    let key = 0;

    for (const currRes of LIST_OF_RESOURCES) {
      arr.push(this.resInput(currRes, key++));
    }

    return arr;
  }

  resInput(res: ResourceString, key: number) {
    return (
      <React.Fragment key={key}>
        <FontAwesomeIcon
          className="one wide"
          icon={resIconMap[res]}
          size="2x"
          color={resColorMap[res]}
        />
        <Form.Field className="two wide">
          <input
            id={`${res}-yop-modal`}
            type="number"
            onChange={this.setNumRes}
            placeholder="0"
          />
        </Form.Field>
      </React.Fragment>
    );
  }

  // TODO: Change GameID
  confirm() {
    const { currValues } = this.state;

    let resToChangeMap: { [index: string]: number } = {};
    for (const currRes of currValues.keys()) {
      const val = currValues.get(currRes);
      if (val !== undefined && val !== 0) {
        resToChangeMap[currRes] = val;
      }
    }

    const change: ResourceChangePackage = {
      gameID: "1",
      playerNumber: this.props.inGamePlayerNumber,
      resourceDeltaMap: resToChangeMap,
    };

    socket.emit("resourceChange", change);

    const emptyMap = new Map<ResourceString, number>();
    for (const res of LIST_OF_RESOURCES) {
      emptyMap.set(res, 0);
    }

    this.props.discardDevCard();

    this.setState({
      modalOpen: false,
      currValues: emptyMap,
    });
  }

  openModal() {
    this.setState({
      modalOpen: true,
    });
  }

  render() {
    return (
      <Modal
        open={this.state.modalOpen}
        trigger={<PlayCardButton openModalFunction={this.openModal} />}
      >
        <Modal.Header>Select 2 Resources</Modal.Header>
        <Modal.Content>
          <div style={{ textAlign: "center" }}>
            <div className="ui form">
              <FormGroup>{this.renderInputs()}</FormGroup>
            </div>
            <Button.Group>
              <Button
                disabled={this.absoluteNumberofResources() !== 2}
                positive
                onClick={this.confirm}
              >
                Confirm
              </Button>
            </Button.Group>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default connector(YOPSelection);
