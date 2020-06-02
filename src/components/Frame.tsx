import React from "react";

export interface FrameProps {
  frameRadius: number;
  centerX: number;
  centerY: number;
}

export class Frame extends React.Component<FrameProps, {}> {
  // Stolen from Tile component
  pointsString() {
    const stt = Math.sqrt(3) / 2;
    const tipX = this.props.centerX;
    const tipY = this.props.centerY - this.props.frameRadius;
    return `
                ${tipX}, ${tipY},
                ${tipX + stt * this.props.frameRadius}, ${
      tipY + this.props.frameRadius / 2
    },
                ${tipX + stt * this.props.frameRadius}, ${
      tipY + (3 * this.props.frameRadius) / 2
    },
                ${tipX}, ${tipY + 2 * this.props.frameRadius},
                ${tipX - stt * this.props.frameRadius}, ${
      tipY + (3 * this.props.frameRadius) / 2
    },
                ${tipX - stt * this.props.frameRadius}, ${
      tipY + this.props.frameRadius / 2
    },
                ${tipX}, ${tipY}
            `;
  }

  render() {
    return (
      <polyline
        fill="#00a6e4"
        // stroke="black"
        strokeWidth="3"
        points={this.pointsString()}
        transform={`rotate(${30}, ${this.props.centerX}, ${
          this.props.centerY
        })`}
      />
    );
  }
}
