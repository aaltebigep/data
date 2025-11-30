// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2025 AAL TEBİGEP, Sena

import { Component, createRef, RefObject, VNode } from "preact";

import "./json.less";
import Button, { ButtonIcon } from "../button/button.tsx";

interface Props {
  object: { [key: string]: any };
}

export default class Json extends Component<Props> {
  span: RefObject<HTMLSpanElement>;

  constructor() {
    super();
    this.span = createRef();
  }

  render() {
    return (
      <pre class="json box">
        <span ref={this.span}>
          {show(this.props.object) ?? "{}"}
        </span>
        <Button
          title="Kopyala"
          icon={ButtonIcon.Copy}
          onClick={() => navigator.clipboard.writeText(this.span.current?.innerText ?? '')} />
      </pre>
    );
  }
}

function show(
  value: any,
  offset: number = 0,
  head: boolean = false,
  classes?: string,
): VNode<any> | null {
  switch (typeof value) {
    case "string":
      if (!value.trim()) return null;
      return (
        <>
          {indent(offset, head)}
          <span class={classes ?? "string"}>
            {JSON.stringify(value.trim())}
          </span>
        </>
      );
    case "number":
      return (
        <>
          {indent(offset, head)}
          <span class={classes ?? "number"}>{value}</span>
        </>
      );
    case "boolean":
      return (
        <>
          {indent(offset, head)}
          <span class={classes ?? "boolean"}>{value}</span>
        </>
      );
    case "object":
      if (value === null) return <span class="null">null</span>;
      else if (Array.isArray(value)) {
        const elements = value.map((el) => show(el, offset + 2, true))
          .filter((el) => el);
        if (!elements.length) return null;

        return (
          <>
            {indent(offset, head)}
            [
            <br />
            {elements.map((el, idx, arr) => (
              <>
                {el}
                {idx == (arr.length - 1) ? "" : ","}
                <br />
              </>
            ))}
            {indent(offset)}
            ]
          </>
        );
      } else {
        const properties = Object.keys(value).map((key) => ({
          key: show(key, offset + 2, true, "key"),
          val: show(value[key], offset + 2),
        })).filter(({ key, val }) => key && val);
        if (!properties.length) return null;

        return (
          <>
            {indent(offset, head)}
            {"{"}
            <br />
            {properties.map(({ key, val }, idx, arr) => (
              <>
                {key}: {val}
                {idx === (arr.length - 1) ? "" : ","}
                <br />
              </>
            ))}
            {indent(offset)}
            {"}"}
          </>
        );
      }
    default:
      return null;
  }
}

function indent(num: number, condition: boolean = true) {
  return condition ? " ".repeat(num) : "";
}
