import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { xValofCorner, yValofCorner } from "../Settlement";
import { resColorMap } from "../../colors";
import { widthOfSVG, heightOfSVG } from "../Board";

export default class City extends Component {
  render() {
    return (
      <div
        style={{
          marginLeft: xValofCorner(0, 0, 4) - widthOfSVG / 2,
          marginTop: yValofCorner(0, 4) - heightOfSVG / 2,
          zIndex: 2,
          position: "absolute",
        }}
      >
        <FontAwesomeIcon
          style={{ stroke: "black", strokeWidth: 30 }}
          size="2x"
          color={resColorMap["wheat"]}
          icon={faWarehouse}
        />
      </div>
    );
  }
}
