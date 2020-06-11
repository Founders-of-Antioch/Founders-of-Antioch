import React, { Component } from "react";
import { Button } from "semantic-ui-react";

export default class ActionButtonSet extends Component {
  render() {
    return (
      <div
        style={{
          zIndex: 1,
          position: "absolute",
          right: "1%",
          bottom: "0%",
        }}
      >
        <Button.Group size="massive">
          <Button color="red" icon="home" />
          <Button color="yellow" icon="warehouse" />
          <Button color="red" icon="road" />
          <Button color="yellow" icon="copy" />
          <Button color="red" icon="handshake" />
          <Button color="yellow" icon="info circle" />
        </Button.Group>
      </div>
    );
  }
}
