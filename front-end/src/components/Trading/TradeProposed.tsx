import React, { Component } from "react";
import { Button, Card } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHorse,
  faBreadSlice,
  faGem,
  faGripVertical,
  faTree,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { colorMap } from "../../colors";
import { PlayerNumber } from "../../redux/Actions";
import { socket } from "../../App";
import { FoAppState } from "../../redux/reducers/reducers";
import { connect } from "react-redux";

type TradeProps = {
  getResources: { [index: string]: number };
  giveResources: { [index: string]: number };
  playerTrading: PlayerNumber;
  tradeIndex: number;
  closeWindowCB: (idx: number) => void;
};

export type ResourceChangePackage = {
  playerNumber: PlayerNumber;
  resourceDeltaMap: { [index: string]: number };
  gameID: string;
};

type ExtraProps = {
  personalPlayerNumber: PlayerNumber;
};

function mapStateToProps(store: FoAppState): ExtraProps {
  return {
    personalPlayerNumber: store.inGamePlayerNumber,
  };
}

type TradeProposedProps = TradeProps & ExtraProps;

class TradeProposed extends Component<TradeProposedProps, {}> {
  constructor(props: TradeProposedProps) {
    super(props);

    this.decline = this.decline.bind(this);
    this.acceptDeal = this.acceptDeal.bind(this);
  }

  listResources(resAmountMap: { [index: string]: number }) {
    let key = 0;
    let resDisplayArr = [];
    let resMap: { [index: string]: IconDefinition } = {
      sheep: faHorse,
      wheat: faBreadSlice,
      ore: faGem,
      brick: faGripVertical,
      wood: faTree,
    };

    for (const currRes in resAmountMap) {
      const currAmount = resAmountMap[currRes];

      resDisplayArr.push(
        <div key={key++}>
          <span className="date">{currAmount + " " + currRes}</span>
          <FontAwesomeIcon
            icon={resMap[currRes]}
            size="2x"
            color={colorMap[currRes]}
          />
        </div>
      );
    }

    return resDisplayArr;
  }

  getNegativeDeltaMap(deltaMap: { [index: string]: number }) {
    let newDTMap: { [index: string]: number } = {};
    for (const key in deltaMap) {
      newDTMap[key] = -deltaMap[key];
    }
    return newDTMap;
  }

  // TODO: Change GameID's
  acceptDeal() {
    const personalGetPkg: ResourceChangePackage = {
      playerNumber: this.props.personalPlayerNumber,
      resourceDeltaMap: this.props.getResources,
      gameID: "1",
    };

    const personalGivePkg: ResourceChangePackage = {
      playerNumber: this.props.personalPlayerNumber,
      resourceDeltaMap: this.getNegativeDeltaMap(this.props.giveResources),
      gameID: "1",
    };

    socket.emit("resourceChange", personalGetPkg);
    socket.emit("resourceChange", personalGivePkg);

    const otherGetPkg: ResourceChangePackage = {
      playerNumber: this.props.playerTrading,
      resourceDeltaMap: this.props.giveResources,
      gameID: "1",
    };

    const otherGivePkg: ResourceChangePackage = {
      playerNumber: this.props.playerTrading,
      resourceDeltaMap: this.getNegativeDeltaMap(this.props.getResources),
      gameID: "1",
    };

    socket.emit("resourceChange", otherGetPkg);
    socket.emit("resourceChange", otherGivePkg);
    this.props.closeWindowCB(this.props.tradeIndex);
  }

  decline() {
    this.props.closeWindowCB(this.props.tradeIndex);
  }

  render() {
    return (
      <div
        style={{
          zIndex: 2,
          position: "absolute",
        }}
      >
        <Card color="black">
          <Card.Content>
            <div style={{ textAlign: "center" }}>
              <Card.Header>
                Trade Proposal from Player {this.props.playerTrading}
              </Card.Header>
            </div>
            <Card.Header>You get:</Card.Header>
            <Card.Meta>{this.listResources(this.props.getResources)}</Card.Meta>
            <Card.Header>They get:</Card.Header>
            <Card.Meta>
              {this.listResources(this.props.giveResources)}
            </Card.Meta>
            <Card.Description>
              <div style={{ textAlign: "center" }}>
                <Button.Group>
                  <Button positive onClick={this.acceptDeal}>
                    Accept
                  </Button>
                  <Button.Or>or</Button.Or>
                  <Button negative onClick={this.decline}>
                    Decline
                  </Button>
                </Button.Group>
              </div>
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

export default connect(mapStateToProps)(TradeProposed);
