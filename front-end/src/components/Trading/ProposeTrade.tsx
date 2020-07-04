import React, { Component, ChangeEvent } from "react";
import { Card, Button, Form, FormGroup } from "semantic-ui-react";
import {
  faHorse,
  faBreadSlice,
  faGem,
  faGripVertical,
  faTree,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resColorMap } from "../../colors";
import { LIST_OF_RESOURCES } from "../../entities/Player";
import { socket } from "../../App";
import { FoAppState } from "../../redux/reducers/reducers";
import { connect, ConnectedProps } from "react-redux";
import { ResourceString } from "../../../../types/Primitives";
import { ProposedTradeSocketPackage } from "../../../../types/SocketPackages";

type PTState = {
  getRes: Map<ResourceString, number>;
  giveRes: Map<ResourceString, number>;
};

type PTProps = {
  onClickCallback: () => void;
};

function mapStateToProps(store: FoAppState) {
  return {
    playerNumber: store.inGamePlayerNumber,
    playersByID: store.playersByID,
  };
}

const connector = connect(mapStateToProps);

type ProposeTradeProps = ConnectedProps<typeof connector> & PTProps;

class ProposeTrade extends Component<ProposeTradeProps, PTState> {
  constructor(props: ProposeTradeProps) {
    super(props);

    let newGetRes = new Map<ResourceString, number>();
    let newGiveRes = new Map<ResourceString, number>();

    for (const res of LIST_OF_RESOURCES) {
      newGetRes.set(res, 0);
      newGiveRes.set(res, 0);
    }

    this.state = {
      getRes: newGetRes,
      giveRes: newGiveRes,
    };

    this.handleResourceChange = this.handleResourceChange.bind(this);
    this.proposeTrade = this.proposeTrade.bind(this);
    this.canTradeProposed = this.canTradeProposed.bind(this);
  }

  proposeTrade() {
    const getMap: { [index: string]: number } = {};
    for (const currKey of [...this.state.getRes.keys()]) {
      const getVal = this.state.getRes.get(currKey);
      if (getVal !== undefined) {
        getMap[currKey] = getVal;
      }
    }

    const giveMap: { [index: string]: number } = {};
    for (const currKey of [...this.state.giveRes.keys()]) {
      const giveVal = this.state.giveRes.get(currKey);
      if (giveVal !== undefined) {
        giveMap[currKey] = giveVal;
      }
    }

    // TODO: Fix Game ID
    const pkg: ProposedTradeSocketPackage = {
      gameID: "1",
      playerNumber: this.props.playerNumber,
      playerGetResources: getMap,
      playerGiveResources: giveMap,
    };
    socket.emit("proposedTrade", pkg);
    this.props.onClickCallback();
  }

  handleResourceChange(e: ChangeEvent<HTMLInputElement>) {
    const partsOfId = e.target.id.split("-");
    const res = partsOfId[1];
    const val = parseInt(e.target.value);
    const giveOrGet = partsOfId[2];

    if (val < 0) {
      // setSTate
    }

    if (giveOrGet === "give") {
      const nextMap = new Map([...this.state.giveRes]);
      nextMap.set(res as ResourceString, val);
      this.setState({
        giveRes: nextMap,
      });
    } else {
      const nextMap = new Map([...this.state.getRes]);
      nextMap.set(res as ResourceString, val);
      this.setState({
        getRes: nextMap,
      });
    }
  }

  listResources(getOrGive: "get" | "give") {
    let res = this.state.getRes.keys();
    let amn = this.state.getRes.values();
    if (getOrGive === "give") {
      res = this.state.giveRes.keys();
      amn = this.state.giveRes.values();
    }
    const resources = [...res];
    const amounts = [...amn];

    let key = 0;
    let resDisplayArr = [];
    let resMap: { [index: string]: IconDefinition } = {
      sheep: faHorse,
      wheat: faBreadSlice,
      ore: faGem,
      brick: faGripVertical,
      wood: faTree,
    };

    for (let i = 0; i < resources.length; i++) {
      const currAmount = amounts[i];
      const currRes = resources[i];

      resDisplayArr.push(
        <div key={key++} className="ui form three wide column">
          <FormGroup>
            <label
              id={`label-${currRes}-${getOrGive}-${key}`}
              className="one wide"
            >
              {currAmount + " " + currRes}
            </label>
            <FontAwesomeIcon
              className="one wide"
              icon={resMap[currRes]}
              size="2x"
              color={resColorMap[currRes]}
            />
            <Form.Field className="five wide">
              <input
                type="number"
                id={`propose-${currRes}-${getOrGive}-${key}`}
                placeholder="0"
                onChange={this.handleResourceChange}
              />
            </Form.Field>
          </FormGroup>
        </div>
      );
    }

    return resDisplayArr;
  }

  canTradeProposed() {
    const { playerNumber, playersByID } = this.props;
    const getPlayer = playersByID.get(playerNumber);

    let canTrade = true;
    if (getPlayer !== undefined) {
      const { giveRes } = this.state;

      giveRes.forEach((currVal, currRes) => {
        const currInHand = getPlayer.getNumberOfResources(currRes);
        if (currInHand < currVal || currVal < 0) {
          canTrade = false;
        }
      });
    }

    return canTrade;
  }

  render() {
    return (
      <div
        style={{
          zIndex: 2,
          position: "absolute",
          right: "0%",
          top: "23.5vh",
        }}
      >
        <Card>
          <Card.Content>
            <div style={{ textAlign: "center" }}>
              <Card.Header>Propose Trade</Card.Header>
            </div>
            <Card.Header>You get:</Card.Header>
            <Card.Meta>{this.listResources("get")}</Card.Meta>
            <Card.Header>They get:</Card.Header>
            <Card.Meta>{this.listResources("give")}</Card.Meta>
            <Card.Description>
              <div style={{ textAlign: "center" }}>
                <Button.Group>
                  <Button
                    positive
                    disabled={!this.canTradeProposed()}
                    onClick={this.proposeTrade}
                  >
                    Propose
                  </Button>
                  <Button negative onClick={this.props.onClickCallback}>
                    Cancel
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

export default connector(ProposeTrade);
