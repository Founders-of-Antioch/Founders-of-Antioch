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

// Stolen from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a: Array<any>) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface BoardProps {
  Tiles?: Array<Tile>;
}

export class Board extends React.Component<{}, {}> {
  makeTiles() {
    let tileKey = 0;
    const widthOfSVG = Number(document.getElementById("root")?.offsetWidth);
    const heightOfSVG = Number(document.getElementById("root")?.offsetHeight);

    let arrTiles = [];
    const resources = this.randomResourceSequence();
    const counters = this.randomCounterSequence();
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
            counter={resources[tileKey] === "desert" ? -1 : counters.pop()}
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
              counter={resources[tileKey] === "desert" ? -1 : counters.pop()}
            />
          );
          tileKey++;
        }
      }
    }
    return arrTiles;
  }

  // Returns an array of strings representing resources put in random order. Reads left to right starting from the top leftmost tile
  // Follows standard rules: 4 wood, 4 sheep, 3 brick, 4 wheat, 3 ore, 1 desert
  randomResourceSequence() {
    let resourcesSequence = ["desert"];
    for (let i = 0; i < 4; i++) {
      resourcesSequence = resourcesSequence
        .concat("wood")
        .concat("sheep")
        .concat("wheat");
    }
    for (let i = 0; i < 3; i++) {
      resourcesSequence = resourcesSequence.concat("brick").concat("ore");
    }

    return shuffle(resourcesSequence);
  }

  randomCounterSequence() {
    let counterSequence = [2, 12];
    for (let i = 0; i < 2; i++) {
      for (let j = 3; j < 12; j++) {
        if (j === 7) {
          continue;
        } else {
          counterSequence.push(j);
        }
      }
    }
    return shuffle(counterSequence);
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
        {/* <polyline points={`${widthOfSVG / 2},0 ${widthOfSVG / 2},${heightOfSVG}`} stroke="yellow" strokeWidth="3" /> */}
        {/* <polyline points={`0,${heightOfSVG / 2} ${widthOfSVG},${heightOfSVG / 2}`} stroke="yellow" strokeWidth="3" /> */}
        <Frame
          frameRadius={frameRadius}
          centerX={widthOfSVG / 2}
          centerY={heightOfSVG / 2}
        />
        {this.makeTiles()}
        <Robber />
      </g>
    );
  }
}
