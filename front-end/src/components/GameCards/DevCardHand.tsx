import React, { Component } from "react";
import { Player } from "../../entities/Player";
import { FoAppState } from "../../redux/reducers/reducers";
import { connect, ConnectedProps } from "react-redux";
import InHandDevCard from "./InHandDevCard";

type DCProps = {
  playerModel: Player;
};

function mapStateToProps(store: FoAppState) {
  const getPlayer = store.playersByID.get(store.inGamePlayerNumber);

  if (getPlayer !== undefined) {
    return {
      playerModel: getPlayer,
    };
  } else {
    console.log(
      "Something is very wrong, the in game player number was not found while trying to render the development cards"
    );
  }
}

const connector = connect(mapStateToProps);

type HandProps = ConnectedProps<typeof connector>;

class DevCardHand extends Component<HandProps, {}> {
  render() {
    const { playerModel } = this.props;

    const hand = playerModel.devCardHand;
    let key = 0;
    let cards = [];
    for (const currCard of hand) {
      cards.push(
        <InHandDevCard
          inGamePNum={this.props.playerModel.playerNum}
          positionIndex={key}
          code={currCard.code}
          key={key++}
        />
      );
    }

    return cards;
  }
}

export default connector(DevCardHand);
