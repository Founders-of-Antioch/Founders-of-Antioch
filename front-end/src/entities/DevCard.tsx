import { DevCardProperties } from "../../../types/entities/DevCard";
import { DevCardCode } from "../../../types/Primitives";

export default class DevCard implements DevCardProperties {
  code: DevCardCode;

  constructor(dcc: DevCardCode) {
    this.code = dcc;
  }
}
