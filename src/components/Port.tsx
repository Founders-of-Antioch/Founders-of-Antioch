import React from "react";

type PortProps = {
  imgX: number;
  imgY: number;
};

export class Port extends React.Component<PortProps, {}> {
  render() {
    const { imgX, imgY } = this.props;

    return (
      <image
        x={imgX}
        y={imgY}
        fill="red"
        href="https://img.icons8.com/material-sharp/24/000000/sailing-ship-medium.png"
      />
    );
  }
}
