import React from "react";
import road from "../icons/road.svg";
import shield from "../icons/shield.svg";
import medal from "../icons/medal.svg";

import { widthOfSVG, heightOfSVG } from "./Board";

const playerCardWidth = widthOfSVG / 5;
const playerCardHeight = playerCardWidth / 2;
const profileImageWidth = playerCardWidth / 4;
const widthOfMiniIcons = playerCardWidth / 10;

type PlayerCardProps = {
  inGamePlayerNum: number;
};

export class PlayerCard extends React.Component<PlayerCardProps, {}> {
  generatePlayerHandInformation(bkgX: number, bkgY: number) {
    const imageMargin = playerCardHeight / 24;

    let miniIcons = [];
    const listOfIcons = [road, shield];
    for (let i = 0; i < listOfIcons.length; i++) {
      const currentQuarterX = (playerCardWidth * (i + 2)) / 4 + bkgX;
      miniIcons.push(
        <g>
          <image
            x={currentQuarterX - widthOfMiniIcons}
            y={bkgY + imageMargin}
            width={widthOfMiniIcons}
            height={widthOfMiniIcons}
            href={listOfIcons[i]}
          />
          <text
            x={currentQuarterX}
            y={bkgY + imageMargin + widthOfMiniIcons - widthOfMiniIcons / 5}
            fontFamily="Courier New"
            fontSize={widthOfMiniIcons}
            fill="white"
          >
            5
          </text>
        </g>
      );
    }

    return miniIcons;
  }

  generateCardInformation(bkgX: number, bkgY: number) {}

  generatePlayerCard(bkgX: number, bkgY: number, playerNumber: number) {
    console.log(this.props.inGamePlayerNum);
    return (
      <g>
        {/* Background */}
        <rect
          x={bkgX}
          y={bkgY}
          width={playerCardWidth}
          height={playerCardHeight}
          fill={"#484848"}
          opacity={0.8}
        />
        {/* Profile Image */}
        <rect
          x={bkgX}
          y={bkgY}
          width={profileImageWidth}
          height={profileImageWidth}
          fill="#00a6e4"
        />
        <text
          x={bkgX}
          y={bkgY + 50}
          fontFamily="Courier New"
          fontSize={widthOfMiniIcons}
          fill="white"
        >
          Player {playerNumber}{" "}
          {this.props.inGamePlayerNum === playerNumber ? "(you)" : ""}
        </text>
        {this.victoryPointsIcon(bkgX, bkgY)}
        {this.generatePlayerHandInformation(bkgX, bkgY)}
      </g>
    );
  }

  generateFourCards() {
    let playerCards = [];
    let playerNumber = 1;
    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        let currX = x * widthOfSVG;
        let currY = y * heightOfSVG;

        if (y === 1) {
          currY -= playerCardHeight;
        }

        if (x === 1) {
          currX -= playerCardWidth;
        }

        playerCards.push(this.generatePlayerCard(currX, currY, playerNumber++));
      }
    }

    return playerCards;
  }

  victoryPointsIcon(bkgX: number, bkgY: number) {
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
          5
        </text>
      </g>
    );
  }

  render() {
    return <g>{this.generateFourCards()}</g>;
  }
}
