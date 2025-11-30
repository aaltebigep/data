import { Component } from "preact";
import Input, { InputType } from "@app/components/input/input.tsx";
import Button, { ButtonIcon } from "@app/components/button/button.tsx";

import "./field.less";

interface Props {
  schema: { [key: string]: any };
  value?: any;
  required?: boolean;
  onChange?: (value: any) => void;
}

interface State {
  id: string;
}

const label = (
  label: string,
  required: boolean = false,
  id?: string,
  tooltipId?: string,
) => (
  label
    ? (
      <label
        for={id}
        aria-describedby={tooltipId ? `${tooltipId}-tooltip` : undefined}
        tabindex={tooltipId ? 0 : undefined}
      >
        {required ? <span class="required" title="Zorunlu">*&#32;</span> : ""}
        {label}
      </label>
    )
    : ""
);

const tooltip = (tooltip: string, id?: string) => (
  tooltip ? <div role="tooltip" id={`${id}-tooltip`}>{tooltip}</div> : ""
);

export default class Field extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      id: crypto.randomUUID(),
    };
  }

  render() {
    const schema = this.props.schema;
    const id = this.state.id;

    switch (schema.type) {
      case "object":
        return (
          <>
            <div class="object">
              {schema["$schema"] ? "" : label(
                schema.title,
                this.props.required,
                undefined,
                schema.description ? id : undefined,
              )}
              {tooltip(schema.description, id)}
              <div>
                {Object.keys(schema.properties).map((key) => (
                  <Field
                    schema={schema.properties[key]}
                    value={this.props.value?.[key]}
                    required={schema.required?.includes(key)}
                    onChange={(v) =>
                      this.props.onChange?.({ ...this.props.value, [key]: v })}
                  />
                ))}
              </div>
            </div>
          </>
        );
      case "array":
        return (
          <>
            <div class="list">
              {label(
                schema.title,
                this.props.required,
                undefined,
                schema.description ? id : undefined,
              )}
              {this.props.value?.map((item: any, index: number) => (
                <div class="item">
                  <Button
                    icon={ButtonIcon.Remove}
                    title="Sil"
                    onClick={() =>
                      this.props.onChange?.(
                        this.props.value.filter((_: any, i: number) =>
                          i !== index
                        ),
                      )}
                  />
                  <Field
                    schema={schema.items}
                    value={item}
                    onChange={(v) => {
                      const now = [...this.props.value];
                      now[index] = v;
                      this.props.onChange?.(now);
                    }}
                  />
                </div>
              ))}
              <Button
                icon={ButtonIcon.Add}
                title="Ekle"
                onClick={() =>
                  this.props.onChange?.([
                    ...(this.props.value ?? []),
                    undefined,
                  ])}
              />
            </div>
          </>
        );
      case "string":
        if (schema.enum?.length) {
          return (
            <div class="field">
              {label(`${schema.title}:`, this.props.required, id)}
              <Input
                name={id}
                type={InputType.Select}
                label={schema.title}
                aria-describedby={schema.description ? `${id}-tooltip` : ""}
                onChange={(event: any) =>
                  this.props.onChange?.(event.target.value)}
              >
                <option value="" selected>&mdash;</option>
                {schema.enum.map((val: string) => (
                  <option value={val} selected={val === this.props.value}>
                    {val}
                  </option>
                ))}
              </Input>
              {tooltip(schema.description, id)}
            </div>
          );
        } else {
          return (
            <div class="field">
              {label(`${schema.title}:`, this.props.required, id)}
              <Input
                name={id}
                type={InputType.Text}
                value={this.props.value}
                label={schema.title}
                aria-describedby={schema.description ? `${id}-tooltip` : ""}
                placeholder={schema.examples?.[0]}
                onInput={(event: any) =>
                  this.props.onChange?.(event.target.value)}
              />
              {tooltip(schema.description, id)}
            </div>
          );
        }
      case "number":
        return (
          <div class="field">
            {label(`${schema.title}:`, this.props.required, id)}
            <Input
              name={id}
              type={InputType.Number}
              value={this.props.value}
              label={schema.title}
              aria-describedby={schema.description ? `${id}-tooltip` : ""}
              placeholder={schema.examples?.[0]}
              onInput={(event: any) =>
                this.props.onChange?.(event.target.valueAsNumber || undefined)}
            />
            {tooltip(schema.description, id)}
          </div>
        );
      default:
        return "";
    }
  }
}
