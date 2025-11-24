import { Component } from "preact";

import "./button.less";

export enum ButtonIcon {
  Back = "back",
  Create = "create",
}

interface Props {
  icon?: ButtonIcon;
  onClick?: (event: PointerEvent) => void;
}

export default class Button extends Component<Props> {
  render() {
    return (
      <button
        type="button"
        data-icon={this.props.icon}
        onClick={this.props.onClick as any}
      >
        {this.props.children}
      </button>
    );
  }
}
