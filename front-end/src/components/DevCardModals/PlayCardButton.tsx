import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { FoAppState } from "../../redux/reducers/reducers";
import { bindActionCreators } from "redux";
import { ConnectedProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { playerHasPlayedDC } from "../../redux/Actions";

function mapStateToProps(store: FoAppState) {
  return {
    hasPlayedDevCard: store.hasPlayedDevCard,
    isTurn: store.currentPersonPlaying === store.inGamePlayerNumber,
    isPlacingSettlement: store.isCurrentlyPlacingSettlement,
    isPlacingRoad: store.isCurrentlyPlacingRoad,
    isPlacingRobber: store.isCurrentlyPlacingRobber,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      playerHasPlayedDC,
    },
    dispatch
  );
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PlayButtonProps = ConnectedProps<typeof connector> & {
  openModalFunction?: () => void;
};

class PlayCardButton extends Component<PlayButtonProps, {}> {
  constructor(props: PlayButtonProps) {
    super(props);

    this.playCard = this.playCard.bind(this);
    this.shouldBeDisabled = this.shouldBeDisabled.bind(this);
  }

  playCard() {
    if (this.props.openModalFunction) {
      this.props.openModalFunction();
    }
    this.props.playerHasPlayedDC(true);
  }

  shouldBeDisabled() {
    const {
      hasPlayedDevCard,
      isTurn,
      isPlacingRoad,
      isPlacingRobber,
      isPlacingSettlement,
    } = this.props;

    return (
      hasPlayedDevCard ||
      !isTurn ||
      isPlacingRoad ||
      isPlacingRobber ||
      isPlacingSettlement
    );
  }

  render() {
    return (
      <Button
        positive
        onClick={this.playCard}
        disabled={this.shouldBeDisabled()}
      >
        Play
      </Button>
    );
  }
}

export default connector(PlayCardButton);
