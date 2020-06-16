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

export default class TradeProposed extends Component<TradeProps, {}> {
  constructor(props: TradeProps) {
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
      playerNumber: 1,
      resourceDeltaMap: this.props.getResources,
      gameID: "1",
    };

    const personalGivePkg: ResourceChangePackage = {
      playerNumber: 1,
      resourceDeltaMap: this.getNegativeDeltaMap(this.props.giveResources),
      gameID: "1",
    };

    socket.emit("resourceChange", personalGetPkg);
    socket.emit("resourceChange", personalGivePkg);

    const otherGetPkg: ResourceChangePackage = {
      playerNumber: 2,
      resourceDeltaMap: this.props.giveResources,
      gameID: "1",
    };

    const otherGivePkg: ResourceChangePackage = {
      playerNumber: 2,
      resourceDeltaMap: this.getNegativeDeltaMap(this.props.getResources),
      gameID: "1",
    };

    socket.emit("resouceChange", otherGetPkg);
    socket.emit("resouceChange", otherGivePkg);
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
