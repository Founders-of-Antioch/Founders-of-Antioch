import TilePoint from "./Points/TilePoint";

export default class PortModel {
  point: TilePoint;
  resource: string;

  constructor(point: TilePoint, res: string) {
    this.point = point;
    this.resource = res;
  }

  getRatioNumber() {
    if (this.resource === "any") {
      return 3;
    } else {
      return 2;
    }
  }
}
