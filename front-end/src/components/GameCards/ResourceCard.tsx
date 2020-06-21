import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colorMap, resIconMap } from "../../colors";
import { ResourceString } from "../../../../types/Primitives";

// TODO: Consider changing amount to state? Might not matter
type RCardProps = {
  resource: ResourceString;
  amount: number;
  positionInHand: number;
};

export class ResourceCard extends React.Component<RCardProps, {}> {
  render() {
    const { amount, resource, positionInHand } = this.props;

    return (
      <div
        style={{
          zIndex: 2,
          position: "absolute",
          bottom: "0%",
          left: `${6 * positionInHand}%`,
        }}
      >
        <div
          className="ui card"
          style={{ maxWidth: "40%", backgroundColor: "wheat" }}
        >
          <div
            className="content"
            style={{
              textAlign: "center",
              marginBottom: "40%",
            }}
          >
            <p
              style={{ paddingRight: "100%", color: "white", fontSize: "3em" }}
              className="header"
            >
              {amount}
            </p>
            <FontAwesomeIcon
              style={{ stroke: "black", strokeWidth: 2 }}
              size="6x"
              color={colorMap[resource]}
              icon={resIconMap[resource]}
            />
          </div>
        </div>
      </div>
    );
  }
}
