import React, { Component } from "react";
import { Icon } from "semantic-ui-react";

export default class DevelopmentCard extends Component {
  render() {
    return (
      <div
        style={{
          zIndex: 2,
          position: "absolute",
          maxWidth: "10%",
        }}
      >
        <div className="ui card">
          <div className="content" style={{ textAlign: "center" }}>
            <Icon
              style={{ marginTop: "40%", marginBottom: "40%" }}
              className="blue circle outline massive"
            />
          </div>
        </div>
      </div>
    );
  }
}
