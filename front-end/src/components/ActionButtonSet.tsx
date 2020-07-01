import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { ABSProps } from "../containter-components/VisibleActionButtonSet";
import ProposeTrade from "./Trading/ProposeTrade";
import {
  roadPointToTouchingBuildingPoints,
  canPutBuildingOn,
} from "../entities/TilePointHelper";
import BankTrade from "./Trading/BankTrade";

type UIState = {
  showProposeTrade: boolean;
};

export default class ActionButtonSet extends Component<ABSProps, UIState> {
  constructor(props: ABSProps) {
    super(props);

    this.state = { showProposeTrade: false };

    this.roadClick = this.roadClick.bind(this);
    this.toggleTradeMenu = this.toggleTradeMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.purchaseDevCard = this.purchaseDevCard.bind(this);
    this.settlementClick = this.settlementClick.bind(this);
    this.cityClick = this.cityClick.bind(this);
    this.hasPlacesToSettle = this.hasPlacesToSettle.bind(this);
  }

  settlementClick() {
    this.props.isPlacingASettlement(true);
  }

  cityClick() {
    this.props.isPlacingACity(true);
  }

  closeMenu() {
    this.setState({
      showProposeTrade: false,
    });
  }

  toggleTradeMenu() {
    this.setState({
      showProposeTrade: !this.state.showProposeTrade,
    });
  }

  getResAmount(res: string): number {
    const { playersByID, inGamePlayerNumber } = this.props;
    const currPlayer = playersByID.get(inGamePlayerNumber);

    if (currPlayer) {
      const currVal = currPlayer.resourceHand.get(res);
      if (currVal !== undefined) {
        return currVal;
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  }

  // TOOD: Make the getters inside the player class
  getNumberOfRoads() {
    const { playersByID, inGamePlayerNumber } = this.props;
    const currPlayer = playersByID.get(inGamePlayerNumber);

    if (currPlayer) {
      return currPlayer.roads.length;
    } else {
      return -1;
    }
  }

  getNumberOfCities() {
    const { playersByID, inGamePlayerNumber } = this.props;
    const currPlayer = playersByID.get(inGamePlayerNumber);

    if (currPlayer) {
      let count = 0;
      for (const build of currPlayer.buildings) {
        if (build.typeOfBuilding === "city") {
          count++;
        }
      }
      return count;
    } else {
      return -1;
    }
  }

  getNumberOfSettlements() {
    const { playersByID, inGamePlayerNumber } = this.props;
    const currPlayer = playersByID.get(inGamePlayerNumber);

    if (currPlayer) {
      let count = 0;
      for (const build of currPlayer.buildings) {
        if (build.typeOfBuilding === "settlement") {
          count++;
        }
      }
      return count;
    } else {
      return -1;
    }
  }

  isTurn() {
    const { inGamePlayerNumber, currentPersonPlaying } = this.props;
    return inGamePlayerNumber === currentPersonPlaying;
  }

  hasPlacesToSettle() {
    const { playersByID, inGamePlayerNumber, boardToBePlayed } = this.props;

    const currPlayer = playersByID.get(inGamePlayerNumber);
    if (currPlayer !== undefined) {
      for (const road of currPlayer.roads) {
        const nearbyBuildingSpots = roadPointToTouchingBuildingPoints(
          road.point
        );
        for (const buildingSpot of nearbyBuildingSpots) {
          if (
            canPutBuildingOn(
              buildingSpot,
              playersByID,
              boardToBePlayed.listOfTiles
            )
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  canTrade() {
    return (
      !this.props.isPlacingRobber &&
      this.isTurn() &&
      this.props.hasRolled &&
      this.props.turnNumber > 2
    );
  }

  canBuySettlement() {
    return (
      this.hasPlacesToSettle() &&
      !(this.getNumberOfSettlements() > 5) &&
      !this.props.isPlacingRobber &&
      this.props.hasRolled &&
      this.isTurn() &&
      this.getResAmount("wood") >= 1 &&
      this.getResAmount("brick") >= 1 &&
      this.getResAmount("sheep") >= 1 &&
      this.getResAmount("wheat") >= 1
    );
  }

  // TODO: Add a get number of cities and check if > 4 here
  // And check for > 0 settlements
  canBuyCity() {
    return (
      !this.props.isPlacingRobber &&
      this.props.hasRolled &&
      this.isTurn() &&
      this.getResAmount("ore") >= 3 &&
      this.getResAmount("wheat") >= 2
    );
  }

  canBuyRoad() {
    return (
      !(this.getNumberOfRoads() > 15) &&
      !this.props.isPlacingRobber &&
      this.props.hasRolled &&
      this.isTurn() &&
      this.getResAmount("wood") >= 1 &&
      this.getResAmount("brick") >= 1
    );
  }

  canBuyDevCard() {
    const { devCardPile, hasRolled } = this.props;
    return (
      !this.props.isPlacingRobber &&
      devCardPile.length > 0 &&
      hasRolled &&
      this.isTurn() &&
      this.getResAmount("sheep") >= 1 &&
      this.getResAmount("ore") >= 1 &&
      this.getResAmount("wheat") >= 1
    );
  }

  roadClick() {
    this.props.isPlacingRoad(true);
  }

  purchaseDevCard() {
    const { inGamePlayerNumber, devCardPile } = this.props;

    if (devCardPile.length !== 0) {
      const topCode = devCardPile[devCardPile.length - 1].code;
      if (topCode !== undefined) {
        this.props.getCurrentPlayerADevelopmentCard(
          inGamePlayerNumber,
          topCode
        );
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.showProposeTrade ? (
          <ProposeTrade onClickCallback={this.closeMenu} />
        ) : null}

        <div
          //TODO: Move to css file
          style={{
            zIndex: 2,
            position: "absolute",
            right: "0%",
            bottom: "0%",
          }}
        >
          <Button.Group size="massive">
            <Button
              color="red"
              icon="home"
              onClick={this.settlementClick}
              disabled={!this.canBuySettlement()}
            />
            <Button
              color="yellow"
              icon="building"
              onClick={this.cityClick}
              disabled={!this.canBuyCity()}
            />
            <Button
              color="red"
              icon="road"
              onClick={this.roadClick}
              disabled={!this.canBuyRoad()}
            />
            <Button
              color="yellow"
              icon="copy"
              onClick={this.purchaseDevCard}
              disabled={!this.canBuyDevCard()}
            />
            <Button
              color="red"
              icon="handshake"
              onClick={this.toggleTradeMenu}
              disabled={!this.canTrade()}
            />
            <BankTrade />
            <Button color="red" icon="info circle" />
          </Button.Group>
        </div>
      </div>
    );
  }
}
