import React from "react";
import { Tile } from "./Tile";
import { Frame } from "./Frame";
import { Port } from "./Port";
import { Robber } from "./Robber";

//This should be fixed to be dynamic for screen size
export const hexRadius = 80;
//Approximate ratio, but might need to be changed for port design
const frameRadius = 5.5 * hexRadius;

export const widthOfSVG = Number(document.getElementById("root")?.offsetWidth);
export const heightOfSVG = Number(
  document.getElementById("root")?.offsetHeight
);

export interface BoardProps {
  resources: Array<string>;
  counters: Array<string>;
}

export class Board extends React.Component<BoardProps, {}> {
  makeTiles() {
    let tileKey = 0;
    const widthOfSVG = Number(document.getElementById("root")?.offsetWidth);
    const heightOfSVG = Number(document.getElementById("root")?.offsetHeight);

    let arrTiles = [];
    const { resources } = this.props;
    // Copy of them because the .pop() actually modifies it upstream in App.tsx
    const counters = [...this.props.counters];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < i + 3; j++) {
        //Absolute GARBAGE
        const x =
          -(hexRadius * Math.sqrt(3)) +
          widthOfSVG / 2 -
          (i * Math.sqrt(3) * hexRadius) / 2 +
          hexRadius * j * Math.sqrt(3);
        let y = -4 * hexRadius + heightOfSVG / 2 + (3 / 2) * hexRadius * i;

        arrTiles.push(
          <Tile
            key={tileKey}
            hexRad={hexRadius}
            resource={resources[tileKey]}
            tipX={x}
            tipY={y}
            counter={
              resources[tileKey] === "desert" ? -1 : Number(counters.pop())
            }
          />
        );
        tileKey++;

        // Add two rows of tiles at the same time if it is not the middle row
        if (i !== 2) {
          y = 2 * hexRadius + heightOfSVG / 2 - (3 / 2) * hexRadius * i;
          arrTiles.push(
            <Tile
              key={tileKey}
              hexRad={hexRadius}
              resource={resources[tileKey]}
              tipX={x}
              tipY={y}
              counter={
                resources[tileKey] === "desert" ? -1 : Number(counters.pop())
              }
            />
          );
          tileKey++;
        }
      }
    }
    return arrTiles;
  }

  constructPorts() {
    let portsArr = [];
    for (let i = 0; i < 9; i++) {
      portsArr.push(
        <Port
          imgX={widthOfSVG / 2 + (2.5 + 0.25) * Math.sqrt(3) * hexRadius}
          imgY={heightOfSVG / 2}
        />
      );
    }

    return portsArr;
  }

  render() {
    return (
      <g>
        <Frame
          frameRadius={frameRadius}
          centerX={widthOfSVG / 2}
          centerY={heightOfSVG / 2}
        />
        {this.makeTiles()}
        <Robber boardResources={this.props.resources} />

        {/* Vertical and horizontal center lines to check for styling. Uncomment if you want to check if something is centered */}
        {/* <polyline
          points={`${widthOfSVG / 2},0 ${widthOfSVG / 2},${heightOfSVG}`}
          stroke="yellow"
          strokeWidth="3"
        />
        <polyline
          points={`0,${heightOfSVG / 2} ${widthOfSVG},${heightOfSVG / 2}`}
          stroke="yellow"
          strokeWidth="3"
        /> */}
      </g>
    );
  }
}
