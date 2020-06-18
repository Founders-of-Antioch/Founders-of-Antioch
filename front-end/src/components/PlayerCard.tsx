import React from "react";

import { widthOfSVG } from "./Board";
import { Player } from "../entities/Player";
import { PlayerNumber } from "../redux/Actions";
import { FoAppState } from "../redux/reducers/reducers";
import { connect, ConnectedProps } from "react-redux";

export const playerCardWidth = widthOfSVG / 7.5;
export const playerCardHeight = playerCardWidth / 2;

type PlayerCardState = {
  currentPersonPlaying: PlayerNumber;
};

function mapStateToProps(store: FoAppState): PlayerCardState {
  return {
    currentPersonPlaying: store.currentPersonPlaying,
  };
}

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type PlayerCardProps = PropsFromRedux & {
  playerModel: Player;
  bkgX: number;
  bkgY: number;
};

class PlayerCard extends React.Component<PlayerCardProps, {}> {
  render() {
    const { bkgX, bkgY, playerModel, currentPersonPlaying } = this.props;
    const isTurn = currentPersonPlaying === playerModel.playerNum;

    const labelStyle = { backgroundColor: "#878683", color: "#bebebe" };
    const labelClass = "ui label";

    return (
      <div
        style={{
          zIndex: 2,
          position: "absolute",
          opacity: isTurn ? 1 : 0.8,
          marginLeft: `${bkgX}px`,
          marginTop: `${bkgY}px`,
        }}
      >
        <div style={{ backgroundColor: "#444444" }} className="ui card">
          <div className="content">
            <p style={{ color: "#bebebe" }} className="header">
              Player {playerModel.playerNum}
            </p>
            <div style={{ textAlign: "center" }} className="ui large labels">
              <div style={labelStyle} className={labelClass}>
                <i className="green trophy icon"></i>{" "}
                {playerModel.victoryPoints}
              </div>
              <div style={labelStyle} className={labelClass}>
                <i className="brown road icon"></i> 23
              </div>
              <div style={labelStyle} className={labelClass}>
                <i className="blue shield icon"></i> {playerModel.knights}
              </div>
              <div style={labelStyle} className={labelClass}>
                <i className="yellow square icon"></i>
                {playerModel.numberOfCardsInHand()}
              </div>
              <div style={labelStyle} className={labelClass}>
                <i className="yellow plus square icon"></i> 23
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connector(PlayerCard);
