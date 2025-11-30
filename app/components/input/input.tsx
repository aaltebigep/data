// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2025 AAL TEBİGEP, Sena

import { Component } from "preact";

import "./input.less";

export enum InputType {
  Select = "select",
  Text = "text",
  Number = "number",
}

export enum TextFormat {
  Text = "text",
  Email = "email",
  Url = "url",
  Date = "date"
}

interface Props {
  type: InputType;
  format?: TextFormat;
  name?: string;
  value?: any;
  required?: boolean;
  label?: string;
  "aria-describedby"?: string;
  placeholder?: string;
  onInput?: (event: InputEvent) => void;
  onChange?: (event: Event) => void;
}

export default class Input extends Component<Props> {
  render() {
    switch (this.props.type) {
      case "select":
        return (
          <select
            name={this.props.name}
            onChange={this.props.onChange}
            aria-label={`${
              this.props.required ? "Zorunlu " : ""
            }Seçim: ${this.props.label}`}
            className={this.props.required ? "required" : ""}
            aria-describedby={this.props["aria-describedby"]}
          >
            {this.props.children}
          </select>
        );
      case "text":
        return (
          <input
            type={this.props.format ?? "text"}
            name={this.props.name}
            value={this.props.value}
            placeholder={this.props.placeholder}
            onChange={this.props.onChange}
            onInput={this.props.onInput}
            aria-label={`${
              this.props.required ? "Zorunlu " : ""
            }Metin Girdisi: ${this.props.label}`}
            className={this.props.required ? "required" : ""}
            aria-describedby={this.props["aria-describedby"]}
          />
        );
      case "number":
        return (
          <input
            type="number"
            name={this.props.name}
            value={this.props.value}
            placeholder={this.props.placeholder}
            onChange={this.props.onChange}
            onInput={this.props.onInput}
            aria-label={`${
              this.props.required ? "Zorunlu " : ""
            }Sayı Girdisi: ${this.props.label}`}
            className={this.props.required ? "required" : ""}
            aria-describedby={this.props["aria-describedby"]}
          />
        );
    }
  }
}
