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

type TradeProps = {
  getResources: { [index: string]: number };
  giveResources: { [index: string]: number };
};

export default class TradeProposed extends Component<TradeProps, {}> {
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
              <Card.Header>Trade Proposal</Card.Header>
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
                  <Button positive>Accept</Button>
                  <Button.Or>or</Button.Or>
                  <Button negative>Decline</Button>
                </Button.Group>
              </div>
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}
