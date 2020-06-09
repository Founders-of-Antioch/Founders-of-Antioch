import React from "react";
import trees from "../icons/trees.svg";
import brick from "../icons/brick.svg";
import wheat from "../icons/wheat.svg";
import rock from "../icons/rock.svg";
import cloud from "../icons/cloud.svg";
import { widthOfSVG, heightOfSVG } from "./Board";

type RCardProps = {
  resource: string;
  x: number;
  y: number;
};

type RCardState = {
  amount: number;
};

export class ResourceCard extends React.Component<RCardProps, RCardState> {
  constructor(props: RCardProps) {
    super(props);
    this.state = {
      amount: 0,
    };
  }

  render() {
    const { resource, x, y } = this.props;
    type resMapType = Record<string, string>;
    const resMap: resMapType = {
      wood: trees,
      sheep: cloud,
      rock: rock,
      wheat: wheat,
      brick: brick,
    };

    const cardWidth = widthOfSVG / 15;
    const cardHeight = (cardWidth * 4) / 3;
    const iconWidth = (cardWidth * 2) / 3;

    return (
      <g>
        <rect
          width={cardWidth}
          height={cardHeight}
          x={x}
          y={y}
          rx={cardWidth / 7}
          ry={cardWidth / 7}
          fill={"wheat"}
          stroke="black"
        />
        <image
          x={cardWidth / 6 + x}
          y={cardHeight / 2 - iconWidth / 2 + y}
          href={resMap[resource]}
          width={iconWidth}
          height={iconWidth}
        />
        <text
          x={x + 10}
          y={y + 40}
          fontFamily="Courier New"
          fontSize={40}
          stroke="black"
          // TODO: Change to dynamic
          strokeWidth="0.5"
          fill="white"
        >
          {this.state.amount}
        </text>
      </g>
    );
  }
}
