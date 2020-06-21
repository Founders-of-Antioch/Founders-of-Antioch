import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { FoAppState } from "../../redux/reducers/reducers";
import { bindActionCreators } from "redux";
import { ConnectedProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { playerHasPlayedDC } from "../../redux/Actions";

type RedProps = {
  hasPlayedDevCard: boolean;
  isTurn: boolean;
};

function mapStateToProps(store: FoAppState): RedProps {
  return {
    hasPlayedDevCard: store.hasPlayedDevCard,
    isTurn: store.currentPersonPlaying === store.inGamePlayerNumber,
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
  }

  playCard() {
    if (this.props.openModalFunction) {
      this.props.openModalFunction();
    }
    this.props.playerHasPlayedDC(true);
  }

  render() {
    return (
      <Button
        positive
        onClick={this.playCard}
        disabled={this.props.hasPlayedDevCard || !this.props.isTurn}
      >
        Play
      </Button>
    );
  }
}

export default connector(PlayCardButton);
