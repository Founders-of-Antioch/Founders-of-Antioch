import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessKnight,
  IconDefinition,
  faRoad,
  faTrophy,
  faBomb,
  faTractor,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import { DevCardCode } from "../../../../types/Primitives";
import { PLAYER_COLORS, WHEAT } from "../../colors";
import { Button } from "semantic-ui-react";
import YOPSelection from "../DevCardModals/YOPSelection";
import {
  DevCardRemovalPackage,
  KnightUpdatePackage,
} from "../../../../types/SocketPackages";
import { socket } from "../../App";
import MonopolySelection from "../DevCardModals/MonopolySelection";
import { FoAppState } from "../../redux/reducers/reducers";
import { Dispatch, bindActionCreators } from "redux";
import { playerIsPlacingRobber } from "../../redux/Actions";
import { ConnectedProps, connect } from "react-redux";
import PlayCardButton from "../DevCardModals/PlayCardButton";

const descriptionMap = {
  KNIGHT:
    "Once played, this card allows you to move the robber to a new tile and steal one resource from any player that has a city or settlement on that tile.",
  YOP: "Take any two resources of your choice from the bank",
  MONOPOLY:
    "Declare one resource that you want and have all other players give you every resource of that type in their hand.",
  VP:
    "This card is good for one victory point. This will activate when you have enough points to win with this card. But since it's not revealed until the end, keep it a secret!",
  ROADS: "Build two roads for free",
};

type CardProps = {
  code: DevCardCode;
  positionIndex: number;
};

function mapStateToProps(store: FoAppState) {
  return {
    inGamePNum: store.inGamePlayerNumber,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({ playerIsPlacingRobber }, dispatch);
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TotalProps = ConnectedProps<typeof connector> & CardProps;

class InHandDevCard extends Component<TotalProps, {}> {
  constructor(props: TotalProps) {
    super(props);

    this.selfDestructSequence = this.selfDestructSequence.bind(this);
    this.playKnightCard = this.playKnightCard.bind(this);
  }

  playKnightCard() {
    this.props.playerIsPlacingRobber(true);
    this.selfDestructSequence();

    // TODO: Update GameID
    const pkg: KnightUpdatePackage = {
      gameID: "1",
      player: this.props.inGamePNum,
    };

    socket.emit("knightUpdate", pkg);
  }

  codeToName(): string {
    const { code } = this.props;

    switch (code) {
      case "KNIGHT":
        return "Knight";
      case "YOP":
        return "Year of Plenty";
      case "ROADS":
        return "Construct Roads";
      case "MONOPOLY":
        return "Monopoly";
      case "VP":
        return "Victory Point";
      default:
        return "Error";
    }
  }

  icon(): IconDefinition {
    const { code } = this.props;

    switch (code) {
      case "KNIGHT":
        return faChessKnight;
      case "YOP":
        return faTractor;
      case "ROADS":
        return faRoad;
      case "MONOPOLY":
        return faMoneyBillWave;
      case "VP":
        //TODO: Change this to have different buildings
        return faTrophy;
      default:
        return faBomb;
    }
  }

  bottomOfCard() {
    const { code } = this.props;

    switch (code) {
      case "YOP":
        return <YOPSelection discardDevCard={this.selfDestructSequence} />;
      case "MONOPOLY":
        return (
          <MonopolySelection
            discardDevCard={this.selfDestructSequence}
            inGamePlayerNumber={this.props.inGamePNum}
          />
        );
      case "VP":
        return <Button disabled>+1 VP</Button>;
      default:
        return <PlayCardButton openModalFunction={this.playKnightCard} />;
    }
  }

  // 😈
  selfDestructSequence() {
    // TODO: Fix GameID
    const removalPackage: DevCardRemovalPackage = {
      gameID: "1",
      playerNumber: this.props.inGamePNum,
      handIndex: this.props.positionIndex,
    };
    socket.emit("devCardRemoval", removalPackage);
  }

  render() {
    const { code, positionIndex } = this.props;
    let pColor = PLAYER_COLORS.get(1);
    if (pColor === undefined) {
      pColor = "green";
    }

    const colorMap: { [index: string]: string } = {
      KNIGHT: "#d3d3d3",
      YOP: "green",
      ROADS: pColor,
      VP: WHEAT,
      MONOPOLY: "green",
    };

    const name = this.codeToName();

    return (
      <div
        style={{
          zIndex: 2,
          position: "absolute",
          left: `${positionIndex * 5}%`,
          width: "10%",
          height: "50%",
        }}
      >
        <div className="ui card" style={{}}>
          <div
            className="content"
            style={{
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "1.5em" }} className="header">
              {name}
            </p>

            <FontAwesomeIcon
              style={{ stroke: "black", strokeWidth: 0 }}
              size="6x"
              color={colorMap[code]}
              icon={this.icon()}
            />

            <p
              style={{ marginTop: "10%", fontSize: "0.8em" }}
              className="description"
            >
              {descriptionMap[code]}
            </p>

            {this.bottomOfCard()}
          </div>
        </div>
      </div>
    );
  }
}

export default connector(InHandDevCard);
