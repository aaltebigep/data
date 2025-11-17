import { Component, VNode } from "preact";

import "./json.less";

function indent(num: number, condition: boolean = true) {
  return condition ? " ".repeat(num) : "";
}

function show(
  value: any,
  offset: number = 0,
  head: boolean = false,
  classes?: string,
): VNode<any> | null {
  switch (typeof value) {
    case "string":
      if (!value) return null;
      return (
        <>
          {indent(offset, head)}
          <span class={classes ?? "string"}>
            {JSON.stringify(value)}
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
        })).filter((obj) => obj.key && obj.val);
        if (!properties.length) return null;

        return (
          <>
            {indent(offset, head)}
            {"{"}
            <br />
            {properties.map((obj, idx, arr) => (
              <>
                {obj.key}: {obj.val}
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

interface JsonProps {
  object: { [key: string]: any };
}

export default class Json extends Component<JsonProps> {
  render() {
    return (
      <pre class="json box">
        {show(this.props.object)}
      </pre>
    );
  }
}
