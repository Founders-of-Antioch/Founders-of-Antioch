import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { ABSProps } from "../containter-components/VisibleActionButtonSet";
import ProposeTrade from "./Trading/ProposeTrade";

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

  isTurn() {
    const { inGamePlayerNumber, currentPersonPlaying } = this.props;
    return inGamePlayerNumber === currentPersonPlaying;
  }

  canTrade() {
    return this.isTurn() && this.props.hasRolled && this.props.turnNumber > 2;
  }

  canBuySettlement() {
    return (
      this.props.hasRolled &&
      this.isTurn() &&
      this.getResAmount("wood") >= 1 &&
      this.getResAmount("brick") >= 1 &&
      this.getResAmount("sheep") >= 1 &&
      this.getResAmount("wheat") >= 1
    );
  }

  canBuyCity() {
    return (
      this.props.hasRolled &&
      this.isTurn() &&
      this.getResAmount("ore") >= 3 &&
      this.getResAmount("wheat") >= 2
    );
  }

  canBuyRoad() {
    return (
      this.props.hasRolled &&
      this.isTurn() &&
      this.getResAmount("wood") >= 1 &&
      this.getResAmount("brick") >= 1
    );
  }

  canBuyDevCard() {
    return (
      this.props.hasRolled &&
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
              disabled={!this.canBuySettlement()}
            />
            <Button
              color="yellow"
              icon="building"
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
            <Button color="yellow" icon="info circle" />
          </Button.Group>
        </div>
      </div>
    );
  }
}
