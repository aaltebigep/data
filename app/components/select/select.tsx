import { Component } from "preact";

import "./select.less";

interface Props {
  onChange?: (event: Event) => void;
}

export default class Select extends Component<Props> {
  render() {
    return (
      <select onChange={this.props.onChange}>
        {this.props.children}
      </select>
    );
  }
}
