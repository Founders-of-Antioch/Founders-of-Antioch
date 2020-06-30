import React, { Component } from "react";
import { Modal, Button } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resIconMap, resColorMap } from "../../colors";
import { LIST_OF_RESOURCES } from "../../entities/Player";
import { FoAppState } from "../../redux/reducers/reducers";
import { Dispatch, bindActionCreators } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { ResourceString } from "../../../../types/Primitives";

type UIState = {
  open: boolean;
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
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
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
      open: true,
    });
  }

  closeModal() {
    this.setState({
      open: false,
    });
  }

  render() {
    const availableBankRes = this.listOfBankRes();

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
        {this.resourceOptions(availableBankRes)}
      </Modal>
    );
  }
}

export default connector(BankTrade);
