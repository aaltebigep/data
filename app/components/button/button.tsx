// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2025 AAL TEBİGEP, Sena

import { Component } from "preact";

import "./button.less";

export enum ButtonIcon {
  Back = "back",
  Add = "add",
  Remove = "remove",
  Copy = "copy",
}

interface Props {
  title?: string;
  icon?: ButtonIcon;
  onClick?: (event: Event) => void;
}

export default class Button extends Component<Props> {
  render() {
    return (
      <button
        type="button"
        data-icon={this.props.icon}
        onClick={this.props.onClick}
        title={this.props.title}
        aria-label={`Tuş: ${this.props.title}`}
      >
        {this.props.children}
      </button>
    );
  }
}
