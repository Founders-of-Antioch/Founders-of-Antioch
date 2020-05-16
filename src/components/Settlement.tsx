import React from "react";

export interface HouseBoardPiece {
  numberOfVictoryPoints: number;
  boardXPos: number;
  boardYPos: number;
}

export class Settlement extends React.Component<HouseBoardPiece, {}> {
  constructor(props: HouseBoardPiece) {
    super({ ...props, numberOfVictoryPoints: 1 });
  }

  render() {
    return <p></p>;
  }
}
