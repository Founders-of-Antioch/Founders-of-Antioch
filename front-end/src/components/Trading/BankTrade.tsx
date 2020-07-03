import React, { Component } from "react";
import { Modal, Button } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resIconMap, resColorMap } from "../../colors";
import { LIST_OF_RESOURCES } from "../../entities/Player";
import { FoAppState } from "../../redux/reducers/reducers";
import { Dispatch, bindActionCreators } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { socket } from "../../App";
import { ResourceChangePackage } from "../../../../types/SocketPackages";

type UIState = {
  open: boolean;
  givingResource: string;
  givingAmount: number;
  gettingResource: string;
};

function mapStateToProps(store: FoAppState) {
  return {
    playersByID: store.playersByID,
    inGamePlayerNumber: store.inGamePlayerNumber,
    isTurn: store.currentPersonPlaying === store.inGamePlayerNumber,
    turnNumber: store.turnNumber,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({}, dispatch);
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type BankTradeProps = ConnectedProps<typeof connector>;

type resourceRatioMap = { [index: string]: number };

class BankTrade extends Component<BankTradeProps, UIState> {
  constructor(props: BankTradeProps) {
    super(props);
    this.state = {
      open: false,
      givingResource: "",
      givingAmount: 0,
      gettingResource: "",
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setGivingResource = this.setGivingResource.bind(this);
    this.setGettingResource = this.setGettingResource.bind(this);
    this.trade = this.trade.bind(this);
  }

  listOfBankRes(): resourceRatioMap {
    const { playersByID, inGamePlayerNumber } = this.props;

    let resList: resourceRatioMap = {};

    const getPlayer = playersByID.get(inGamePlayerNumber);
    if (getPlayer) {
      const ports = getPlayer.ports();
      let playerHasAnyPort = false;

      for (const port of ports) {
        if (port.resource === "any") {
          playerHasAnyPort = true;
        }
      }

      for (const currRes of LIST_OF_RESOURCES) {
        const currVal = getPlayer.getNumberOfResources(currRes);

        if (currVal >= 4) {
          resList[currRes] = 4;
        }

        if (playerHasAnyPort && currVal >= 3) {
          resList[currRes] = 3;
        }
      }

      console.log(ports);
      for (const port of ports) {
        if (port.resource !== "any") {
          const amount = port.getRatioNumber();
          console.log(port.resource);
          console.log(getPlayer.getNumberOfResources(port.resource));
          console.log(amount);
          if (getPlayer.getNumberOfResources(port.resource) >= amount) {
            resList[port.resource] = amount;
          }
        }
      }
    }

    return resList;
  }

  setGivingResource(res: string, amount: number) {
    this.setState({
      ...this.state,
      givingResource: res,
      givingAmount: amount,
    });
  }

  setGettingResource(res: string) {
    this.setState({
      ...this.state,
      gettingResource: res,
    });
  }

  resourceOptions(tradeResources: resourceRatioMap) {
    let arr = [];
    let key = 0;
    for (const currRes in tradeResources) {
      arr.push(
        <Button
          style={{
            marginTop: "5%",
            marginBottom: "5%",
          }}
          key={key++}
          onClick={() =>
            this.setGivingResource(currRes, tradeResources[currRes])
          }
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
          <p style={{ marginTop: "10%" }}>{tradeResources[currRes]}:1</p>
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
      givingResource: "",
      givingAmount: 0,
      gettingResource: "",
    });
  }

  trade() {
    const { givingResource, gettingResource, givingAmount } = this.state;
    const { inGamePlayerNumber } = this.props;

    const pkg: ResourceChangePackage = {
      gameID: "1",
      playerNumber: inGamePlayerNumber,
      resourceDeltaMap: {
        [givingResource]: -givingAmount,
        [gettingResource]: 1,
      },
    };

    socket.emit("resourceChange", pkg);
    this.closeModal();
  }

  render() {
    const availableBankRes = this.listOfBankRes();
    const { givingResource, gettingResource } = this.state;
    const { turnNumber, isTurn } = this.props;

    return (
      <Modal
        trigger={
          <Button
            disabled={
              !isTurn ||
              turnNumber <= 2 ||
              Object.keys(availableBankRes).length === 0
            }
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
