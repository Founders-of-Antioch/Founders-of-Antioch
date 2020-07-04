import React, { Component } from "react";
import { Port } from "../Port";
import TilePoint from "../../entities/Points/TilePoint";
import PortModel from "../../entities/PortModel";

const PORT_BUILDING_SPOTS = [
  new TilePoint(-1, -2, 2),
  new TilePoint(-1, -2, 3),
  new TilePoint(1, -1, 2),
  new TilePoint(1, -1, 3),
  new TilePoint(2, 0, 1),
  new TilePoint(2, 0, 2),
  new TilePoint(2, 1, 0),
  new TilePoint(2, 1, 1),
  new TilePoint(1, 2, 0),
  new TilePoint(1, 2, 1),
  new TilePoint(0, 2, 5),
  new TilePoint(0, 2, 0),
  new TilePoint(-1, 1, 4),
  new TilePoint(-1, 1, 5),
  new TilePoint(-2, -1, 4),
  new TilePoint(-2, -1, 5),
  new TilePoint(-2, -2, 3),
  new TilePoint(-2, -2, 4),
];

const PORT_RES = [
  "any",
  "sheep",
  "any",
  "ore",
  "wheat",
  "any",
  "wood",
  "brick",
  "any",
];

export let PORT_MODELS: Array<PortModel> = [];

for (let idx = 0; idx < PORT_BUILDING_SPOTS.length; idx++) {
  const currRes = PORT_RES[Math.floor(idx / 2)];

  PORT_MODELS.push(new PortModel(PORT_BUILDING_SPOTS[idx], currRes));
}

export default class PortSet extends Component {
  constructPorts() {
    let portArr = [];
    let key = 0;

    const portsToRender = PORT_MODELS.filter((el, idx) => idx % 2 === 0);

    for (let i = 0; i < portsToRender.length; i++) {
      portArr.push(<Port key={key++} model={portsToRender[i]} />);
    }

    return portArr;
  }

  render() {
    return this.constructPorts();
  }
}
