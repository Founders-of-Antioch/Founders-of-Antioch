import React from "react";
import brick from "../img/brick.jpeg";
import { SAND, BRICK, WHEAT } from "../colors";
// import sheep from "../img/sheep.jpg";

// Tip is the top 'tip' of the resource hexagon tile
// Counter is the proability counter that should be place on the resource tile. Use -1 for no counter
// TODO: Refactor now that we have 'TileModel'
export interface TileProps {
  resource: string;
  hexRad: number;
  tipX: number;
  tipY: number;
  counter: number;
}

export class Tile extends React.Component<TileProps, {}> {
  //Special garbage code
  pointsString() {
    const stt = Math.sqrt(3) / 2;
    return `
                ${this.props.tipX}, ${this.props.tipY},
                ${this.props.tipX + stt * this.props.hexRad}, ${
      this.props.tipY + this.props.hexRad / 2
    },
                ${this.props.tipX + stt * this.props.hexRad}, ${
      this.props.tipY + (3 * this.props.hexRad) / 2
    },
                ${this.props.tipX}, ${this.props.tipY + 2 * this.props.hexRad},
                ${this.props.tipX - stt * this.props.hexRad}, ${
      this.props.tipY + (3 * this.props.hexRad) / 2
    },
                ${this.props.tipX - stt * this.props.hexRad}, ${
      this.props.tipY + this.props.hexRad / 2
    },
                ${this.props.tipX}, ${this.props.tipY}
            `;
  }

  colorOfTile() {
    switch (this.props.resource) {
      case "ore":
        return "grey";
      case "wheat":
        return WHEAT;
      case "sheep":
        return "gainsboro";
      case "wood":
        return "#8B4513";
      case "desert":
        return "#e9b13f";
      case "brick":
        return BRICK;
      default:
        return "purple";
    }
  }

  makeProbabilityCircles() {
    const { counter, tipX, tipY, hexRad } = this.props;

    let listOfCircles = [];
    const possibleCirclesUpside = [1, 2, 3, 4, 5].reverse();
    const numCircles =
      counter < 7 ? counter - 1 : possibleCirclesUpside[counter - 8];
    let key = 0;
    for (let i = 0; i < numCircles; i++) {
      listOfCircles.push(
        <circle
          key={key++}
          r={`${hexRad / 40}`}
          fill={counter === 6 || counter === 8 ? "red" : "black"}
          //First half is space between dots, second half is aligining them to be in the center
          //Should be refactored to adjust for diff screen sizes - it's absolute rn and should be dynamic
          cx={tipX + i * 8 - (numCircles - 1) * 4}
          cy={tipY + hexRad + hexRad / 10}
        />
      );
    }

    return listOfCircles;
  }

  makeCounter() {
    const { counter, tipX, tipY, hexRad } = this.props;

    if (counter !== -1) {
      return (
        <g>
          <circle r={hexRad / 3} fill="#ffe19e" cx={tipX} cy={tipY + hexRad} />
          <text
            x={tipX}
            y={tipY + hexRad}
            textAnchor="middle"
            fontWeight="bold"
            fontSize={`${hexRad / 50}em`}
            fill={counter === 6 || counter === 8 ? "red" : "black"}
          >
            {counter}
          </text>
          {this.makeProbabilityCircles()}
        </g>
      );
    }
  }

  getImage() {
    switch (this.props.resource) {
      case "brick":
        return brick;
    }
  }

  render() {
    return (
      <g>
        {/* <defs>
          <pattern
            id="resourceClip"
            x="0%"
            y="0%"
            height="100%"
            width="100%"
            viewBox="0 50 1000 1000"
          >
            <image
              preserveAspectRatio="none"
              x="0%"
              y="0%"
              width="1000"
              height="1500"
              href={sheep}
            />
          </pattern>
        </defs> */}

        <polyline
          id={this.props.resource}
          fill={this.colorOfTile()}
          stroke={SAND}
          // TODO: Change to be dynamic
          strokeWidth="5"
          points={this.pointsString()}
        />
        {/* <polyline
          id={this.props.resource}
          fill="url(#resourceClip)"
          stroke="#ffe39f"
          strokeWidth="5"
          points={this.pointsString()}
        /> */}
        {this.makeCounter()}
      </g>
    );
  }
}
