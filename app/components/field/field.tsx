import { Component } from "preact";
import Input, { InputType } from "@app/components/input/input.tsx";
import Button, { ButtonIcon } from "@app/components/button/button.tsx";

import "./field.less";

interface Props {
  schema: { [key: string]: any };
  value?: any;
  onChange?: (value: any) => void;
}

export default class Field extends Component<Props> {
  render() {
    const schema = this.props.schema;
    const id = crypto.randomUUID();

    switch (schema.type) {
      case "object":
        return (
          <>
            {schema["$schema"] ? "" : (
              <label>
                {schema.title}
              </label>
            )}
            <div class="object">
              {Object.keys(schema.properties).map((key) => (
                <Field
                  schema={schema.properties[key]}
                  value={this.props.value?.[key]}
                  onChange={(v) =>
                    this.props.onChange?.({ ...this.props.value, [key]: v })}
                />
              ))}
            </div>
          </>
        );
      case "array":
        return (
          <>
            <label>
              {schema.title}
            </label>
            <div class="list">
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
                  this.props.onChange?.([...(this.props.value ?? []), {}])}
              />
            </div>
          </>
        );
      case "string":
        if (schema.enum?.length) {
          return (
            <div class="field">
              <label for={id}>{schema.title}:</label>
              <Input
                name={id}
                type={InputType.Select}
                title={schema.title}
                onChange={(event: any) =>
                  this.props.onChange?.(event.target.value)}
              >
                <option value="" selected>␣</option>
                {schema.enum.map((val: string) => (
                  <option value={val} selected={val === this.props.value}>
                    {val}
                  </option>
                ))}
              </Input>
            </div>
          );
        } else {
          return (
            <div class="field">
              <label for={id}>{schema.title}:</label>
              <Input
                name={id}
                type={InputType.Text}
                value={this.props.value}
                title={schema.title}
                placeholder={schema.examples?.[0]}
                onInput={(event: any) =>
                  this.props.onChange?.(event.target.value)}
              />
            </div>
          );
        }
      case "number":
        return (
          <div class="field">
            <label for={id}>{schema.title}:</label>
            <Input
              name={id}
              type={InputType.Number}
              value={this.props.value}
              title={schema.title}
              placeholder={schema.examples?.[0]}
              onInput={(event: any) =>
                this.props.onChange?.(Number(event.target.value))}
            />
          </div>
        );
      default:
        return "";
    }
  }
}
