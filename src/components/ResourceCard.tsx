import React from "react";
import { SAND } from "../colors";

export class ResourceCard extends React.Component<{}, {}> {
  render() {
    return (
      <rect
        stroke={"black"}
        strokeWidth="3"
        width={150}
        height={200}
        x={0}
        y={0}
        rx={20}
        ry={20}
        fill={SAND}
      />
    );
  }
}
