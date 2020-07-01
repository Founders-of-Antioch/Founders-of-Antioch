import React, { Component } from "react";
import { Modal, Button } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resIconMap, resColorMap } from "../../colors";
import { LIST_OF_RESOURCES } from "../../entities/Player";
import { FoAppState } from "../../redux/reducers/reducers";
import { Dispatch, bindActionCreators } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { ResourceString } from "../../../../types/Primitives";
import { socket } from "../../App";
import { ResourceChangePackage } from "../../../../types/SocketPackages";

type UIState = {
  open: boolean;
  givingResource: string;
  gettingResource: string;
};

function mapStateToProps(store: FoAppState) {
  return {
    playersByID: store.playersByID,
    inGamePlayerNumber: store.inGamePlayerNumber,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({}, dispatch);
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type BankTradeProps = ConnectedProps<typeof connector>;

class BankTrade extends Component<BankTradeProps, UIState> {
  constructor(props: BankTradeProps) {
    super(props);
    this.state = {
      open: false,
      givingResource: "",
      gettingResource: "",
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setGivingResource = this.setGivingResource.bind(this);
    this.setGettingResource = this.setGettingResource.bind(this);
    this.trade = this.trade.bind(this);
  }

  listOfBankRes(): Array<ResourceString> {
    const { playersByID, inGamePlayerNumber } = this.props;

    let resList: Array<ResourceString> = [];

    const getPlayer = playersByID.get(inGamePlayerNumber);
    if (getPlayer) {
      for (const currRes of LIST_OF_RESOURCES) {
        const currVal = getPlayer.resourceHand.get(currRes);

        if (currVal !== undefined && currVal >= 4) {
          resList.push(currRes);
        }
      }
    }

    return resList;
  }

  setGivingResource(res: string) {
    this.setState({
      ...this.state,
      givingResource: res,
    });
  }

  setGettingResource(res: string) {
    this.setState({
      ...this.state,
      gettingResource: res,
    });
  }

  resourceOptions(tradeResources: Array<ResourceString>) {
    let arr = [];
    let key = 0;
    for (const currRes of tradeResources) {
      arr.push(
        <Button
          style={{
            marginTop: "5%",
            marginBottom: "5%",
          }}
          key={key++}
          onClick={() => this.setGivingResource(currRes)}
        >
          <FontAwesomeIcon
            size="7x"
            style={{
              strokeWidth: currRes === "sheep" ? 3 : 0,
              stroke: currRes === "sheep" ? "black" : "",
            }}
            color={resColorMap[currRes]}
            icon={resIconMap[currRes]}
          />
          <p style={{ marginTop: "10%" }}>4:1</p>
        </Button>
      );
    }

    return arr;
  }

  chooseGetOption() {
    const { gettingResource } = this.state;

    let arr = [];
    let key = 0;
    for (const currRes of LIST_OF_RESOURCES) {
      arr.push(
        <Button
          style={{
            marginTop: "5%",
            marginBottom: "5%",
          }}
          toggle
          active={gettingResource === currRes}
          key={key++}
          onClick={() => this.setGettingResource(currRes)}
        >
          <FontAwesomeIcon
            size="7x"
            style={{
              strokeWidth: currRes === "sheep" ? 3 : 0,
              stroke: currRes === "sheep" ? "black" : "",
            }}
            color={resColorMap[currRes]}
            icon={resIconMap[currRes]}
          />
          <p style={{ marginTop: "10%" }}>4:1</p>
        </Button>
      );
    }

    return arr;
  }

  openModal() {
    this.setState({
      ...this.state,
      open: true,
    });
  }

  closeModal() {
    this.setState({
      ...this.state,
      open: false,
    });
  }

  trade() {
    const { givingResource, gettingResource } = this.state;
    const { inGamePlayerNumber } = this.props;

    const pkg: ResourceChangePackage = {
      gameID: "1",
      playerNumber: inGamePlayerNumber,
      resourceDeltaMap: { [givingResource]: -4, [gettingResource]: 1 },
    };

    socket.emit("resourceChange", pkg);
    this.closeModal();
  }

  render() {
    const availableBankRes = this.listOfBankRes();
    // Use this for testing/debugging by commenting out this ^ and uncomment below
    // const availableBankRes: Array<ResourceString> = ["wheat", "ore"];
    const { givingResource, gettingResource } = this.state;

    return (
      <Modal
        trigger={
          <Button
            disabled={availableBankRes.length === 0}
            onClick={this.openModal}
            color="yellow"
            icon="money bill alternate outline"
          />
        }
        style={{ textAlign: "center" }}
        open={this.state.open}
      >
        <Modal.Header>Bank Trade</Modal.Header>
        <Modal.Content>
          {givingResource === ""
            ? this.resourceOptions(availableBankRes)
            : this.chooseGetOption()}
        </Modal.Content>
        <Modal.Description style={{ marginBottom: "2%" }}>
          <Button
            onClick={this.trade}
            positive
            disabled={gettingResource === ""}
          >
            Confirm
          </Button>
          <Button negative onClick={this.closeModal}>
            Cancel
          </Button>
        </Modal.Description>
      </Modal>
    );
  }
}

export default connector(BankTrade);
