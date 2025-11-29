import { Component } from "preact";

import "./input.less";

export enum InputType {
  Select = "select",
  Text = "text",
  Number = "number",
}

interface Props {
  type: InputType;
  name?: string;
  value?: any;
  title?: string;
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
            title={this.props.title}
            onChange={this.props.onChange}
            aria-label={`Seç: ${this.props.title}`}
          >
            {this.props.children}
          </select>
        );
      case "text":
        return (
          <input
            type="text"
            name={this.props.name}
            value={this.props.value}
            title={this.props.title}
            placeholder={this.props.placeholder}
            onChange={this.props.onChange}
            onInput={this.props.onInput}
            aria-label={`Metin Girdisi: ${this.props.title}`}
          />
        );
      case "number":
        return (
          <input
            type="number"
            name={this.props.name}
            value={this.props.value}
            placeholder={this.props.placeholder}
            title={this.props.title}
            onChange={this.props.onChange}
            onInput={this.props.onInput}
            aria-label={`Sayı Girdisi: ${this.props.title}`}
          />
        );
    }
  }
}
