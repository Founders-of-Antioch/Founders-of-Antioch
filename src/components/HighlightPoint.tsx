import React, { Component } from "react";
import { WHITE } from "../colors";
import { xValofCorner, yValofCorner } from "./Settlement";
import { widthOfSVG, hexRadius } from "./Board";
import { socket } from "../App";
import { createStore } from "redux";
import FoApp from "../reducers";
import { placeSettlement, PlayerNumber } from "../Actions";

// Highlights a point where a player can build a settlement

type Props = {
  boardXPos: number;
  boardYPos: number;
  corner: number;
  finishedSelectingCallback: Function;
  playerWhoSelected: PlayerNumber;
  // Should be 'road' or 'settlement'
  typeOfHighlight: string;
};

const store = createStore(FoApp);
const unsubscribe = store.subscribe(() => {
  console.log(store.getState());
});

export default class HighlightPoint extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.selectedASettlementSpot = this.selectedASettlementSpot.bind(this);
    this.selectedARoadSpot = this.selectedARoadSpot.bind(this);
  }

  // TODO: Replace with actual gameID
  selectedASettlementSpot(): void {
    const { boardXPos, boardYPos, corner, playerWhoSelected } = this.props;
    // Emit change for broadcast
    socket.emit(
      "addBuilding",
      "1",
      boardXPos,
      boardYPos,
      corner,
      playerWhoSelected
    );
    store.dispatch(
      placeSettlement(boardXPos, boardYPos, corner, playerWhoSelected)
    );
    this.props.finishedSelectingCallback();
  }

  selectedARoadSpot(): void {
    const { boardXPos, boardYPos, playerWhoSelected, corner } = this.props;

    // TODO: Replace with actual gameID
    socket.emit(
      "addRoad",
      "1",
      boardXPos,
      boardYPos,
      corner,
      playerWhoSelected
    );
    this.props.finishedSelectingCallback();
  }

  render() {
    const { boardXPos, boardYPos, corner, typeOfHighlight } = this.props;

    let x = xValofCorner(boardXPos, boardYPos, corner);
    let y = yValofCorner(boardYPos, corner);

    const isRoad = typeOfHighlight === "road";

    // Special garbo adjustment if it's a road highlight
    if (isRoad) {
      const sign = corner < 3 ? 1 : -1;

      if (corner === 0 || corner === 5) {
        x += (hexRadius * Math.sqrt(3)) / 4;
        y = y + (hexRadius / 4) * sign;
      } else if (corner === 2 || corner === 3) {
        x -= (hexRadius * Math.sqrt(3)) / 4;
        y = y + (hexRadius / 4) * sign;
      } else {
        y = y + (hexRadius / 2) * sign;
      }
    }

    return (
      <circle
        cx={x}
        cy={y}
        r={widthOfSVG / 100}
        stroke={WHITE}
        // TODO: Change to dynamic
        strokeWidth={2}
        cursor="pointer"
        fill="white"
        fillOpacity={0.25}
        onClick={isRoad ? this.selectedARoadSpot : this.selectedASettlementSpot}
      />
    );
  }
}
