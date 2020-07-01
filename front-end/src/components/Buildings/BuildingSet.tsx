import React, { Component } from "react";
import { FoAppState } from "../../redux/reducers/reducers";
import { connect, ConnectedProps } from "react-redux";
import City from "./City";
import { Settlement } from "../Settlement";

function mapStateToProps(store: FoAppState) {
  return {
    playersByID: store.playersByID,
  };
}

const connector = connect(mapStateToProps);

type CitySetProps = ConnectedProps<typeof connector>;

// Renders all of the buildings in the current game
class CitySet extends Component<CitySetProps, {}> {
  render() {
    const { playersByID } = this.props;

    const arr = [];
    let key = 0;

    for (const currPlayer of playersByID.values()) {
      for (const currBuild of currPlayer.buildings) {
        if (currBuild.typeOfBuilding === "settlement") {
          arr.push(
            <Settlement
              key={key++}
              point={currBuild.point}
              playerNum={currBuild.playerNum}
            />
          );
        } else {
          arr.push(<City key={key++} buildModel={currBuild} />);
        }
      }
    }

    return arr;
  }
}

export default connector(CitySet);
