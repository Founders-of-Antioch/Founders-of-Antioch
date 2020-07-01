import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { xValofCorner, yValofCorner } from "../Settlement";
import { PLAYER_COLORS } from "../../colors";
import { widthOfSVG, heightOfSVG } from "../Board";
import { Building } from "../../entities/Building";

type CityProps = {
  buildModel: Building;
};

export default class City extends Component<CityProps, {}> {
  render() {
    const { buildModel } = this.props;

    const x = xValofCorner(
      buildModel.point.boardPoint.boardXPos,
      buildModel.point.boardPoint.boardYPos,
      buildModel.point.positionOnTile
    );
    const y = yValofCorner(
      buildModel.point.boardPoint.boardYPos,
      buildModel.point.positionOnTile
    );

    return (
      <div
        style={{
          // TODO: Change (widthsvg/100) to half of the width of the icon
          marginLeft: x - widthOfSVG / 100,
          marginTop: y - heightOfSVG / 2,
          zIndex: 2,
          position: "absolute",
        }}
      >
        <FontAwesomeIcon
          style={{ stroke: "black", strokeWidth: 30 }}
          size="2x"
          color={PLAYER_COLORS.get(buildModel.playerNum)}
          icon={faWarehouse}
        />
      </div>
    );
  }
}
