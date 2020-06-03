import React from "react";
import road from "../icons/road.svg";
import shield from "../icons/shield.svg";
import medal from "../icons/medal.svg";

import { widthOfSVG, heightOfSVG } from "./Board";
import { Player } from "../entities/Player";
import { PLAYER_COLORS } from "../colors";

// Mini cards displaying player info
// TODO: Design, make more minimal
// TODO: Logic, class shouldn't have all four cards

export const playerCardWidth = widthOfSVG / 7.5;
export const playerCardHeight = playerCardWidth / 2;
const profileImageWidth = playerCardWidth / 4;
const widthOfMiniIcons = playerCardWidth / 10;

type PlayerCardProps = {
  playerModel: Player;
  bkgX: number;
  bkgY: number;
  currentPersonPlaying: number;
};

// TODO: Try and not make this global, but I just wanted to get rid of the React error
let keyForTag = 0;

export class PlayerCard extends React.Component<PlayerCardProps, {}> {
  generatePlayerStats() {
    const { playerModel, bkgX, bkgY } = this.props;

    const imageMargin = playerCardHeight / 24;

    let miniIcons = [];
    let keyForGroup = 0;
    const listOfIcons = [road, shield];

    for (let i = 0; i < listOfIcons.length; i++) {
      const currentQuarterX = (playerCardWidth * (i + 1)) / 3 + bkgX;

      miniIcons.push(
        <g key={keyForGroup++}>
          <image
            x={currentQuarterX + imageMargin}
            y={bkgY + imageMargin}
            width={widthOfMiniIcons}
            height={widthOfMiniIcons}
            href={listOfIcons[i]}
          />
          <text
            x={currentQuarterX + imageMargin * 2 + widthOfMiniIcons}
            y={bkgY + imageMargin + widthOfMiniIcons - widthOfMiniIcons / 5}
            fontFamily="Courier New"
            fontSize={widthOfMiniIcons}
            fill="white"
          >
            5{/* {playerModel[listOfAttrs[i]]} */}
          </text>
        </g>
      );
    }

    return miniIcons;
  }

  generatePlayerHandInformation() {
    const { playerModel, bkgX, bkgY } = this.props;

    const imageMargin = playerCardHeight / 24;

    let cardIcons = [];
    let keyForGroup = 0;
    const listOfIcons = [road, shield];

    for (let i = 0; i < listOfIcons.length; i++) {
      const currentQuarterX = (playerCardWidth * (i + 1)) / 3 + bkgX;
      // Just places it -imagemargin- away from the bottom of the bkg
      const y = bkgY + playerCardHeight - widthOfMiniIcons * 2 - imageMargin;

      cardIcons.push(
        <g key={keyForGroup++}>
          <rect
            x={currentQuarterX + imageMargin}
            y={y}
            width={widthOfMiniIcons}
            height={widthOfMiniIcons * 2}
            stroke="white"
            fill="none"
            strokeWidth={widthOfMiniIcons / 7.5}
            rx={widthOfMiniIcons / 10}
            ry={widthOfMiniIcons / 10}
          />

          <text
            x={currentQuarterX + imageMargin * 2 + widthOfMiniIcons}
            y={y + widthOfMiniIcons * 1.5 - imageMargin}
            fontFamily="Courier New"
            fontSize={widthOfMiniIcons}
            fill="white"
          >
            5{/* {playerModel[listOfAttrs[i]]} */}
          </text>
        </g>
      );
    }

    return cardIcons;
  }

  victoryPointsIcon(bkgX: number, bkgY: number) {
    const { playerModel } = this.props;

    const halfProfilePicX = playerCardWidth / 8 + bkgX;
    const halfCardY = playerCardHeight * 0.5 + bkgY;

    return (
      <g>
        <image
          x={halfProfilePicX - widthOfMiniIcons}
          y={halfCardY + widthOfMiniIcons / 2}
          width={widthOfMiniIcons}
          height={widthOfMiniIcons}
          href={medal}
        />
        <text
          x={halfProfilePicX}
          y={halfCardY + (widthOfMiniIcons * 4) / 3}
          fontFamily="Courier New"
          fontSize={widthOfMiniIcons}
          fill="white"
        >
          {playerModel.victoryPoints}
        </text>
      </g>
    );
  }

  render() {
    const { bkgX, bkgY, playerModel, currentPersonPlaying } = this.props;
    const playerTextMargin = 0.05 * playerCardHeight;
    const isTurn = currentPersonPlaying === playerModel.playerNum;

    return (
      <g key={keyForTag++}>
        {/* Background */}
        <rect
          x={bkgX}
          y={bkgY}
          width={playerCardWidth}
          height={playerCardHeight}
          fill={"#484848"}
          opacity={0.8}
          stroke={isTurn ? PLAYER_COLORS[playerModel.playerNum - 1] : "none"}
          strokeWidth={playerCardWidth / 45}
        />
        {/* Profile Image */}
        <rect
          x={bkgX}
          y={bkgY}
          width={profileImageWidth}
          height={profileImageWidth}
          fill={PLAYER_COLORS[playerModel.playerNum - 1]}
        />
        <text
          x={bkgX + playerTextMargin}
          y={bkgY + playerCardHeight - playerTextMargin}
          fontFamily="Courier New"
          fontSize={widthOfMiniIcons / 2}
          fill="white"
        >
          Player {playerModel.playerNum}{" "}
        </text>
        {this.victoryPointsIcon(bkgX, bkgY)}
        {this.generatePlayerStats()}
        {this.generatePlayerHandInformation()}
      </g>
    );
  }
}
