import { Component } from "preact";

import { Page } from "@app/lib/context.ts";
import Menu from "@app/pages/menu/menu.tsx";
import Button, { ButtonIcon } from "@app/components/button/button.tsx";
import Input, { InputType } from "@app/components/input/input.tsx";
import Field from "@app/components/field/field.tsx";
import Json from "@app/components/json/json.tsx";

import "./editor.less";

interface State {
  schemas?: { [key: string]: { [key: string]: any } };
  schema?: { [key: string]: any };
  object: { [key: string]: any };
}

export default class Editor
  extends Component<Record<PropertyKey, never>, State> {
  constructor() {
    super();
    this.state = {
      object: {},
    };
  }

  override async componentDidMount(): Promise<void> {
    try {
      const response = await fetch(
        "https://aaltebigep.github.io/data/schemas.json",
      );
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      const result = await response.json();
      this.setState({
        ...this.state,
        schemas: result,
        schema: result[Object.keys(result)[0]],
        object: {},
      });
    } catch (e: any) {
      console.error(e.message);
    }
  }

  render() {
    return (
      <div id="editor">
        <div class="side">
          <Page.Consumer>
            {({ setPage }) => (
              <nav class="box">
                <Button
                  icon={ButtonIcon.Back}
                  onClick={() => setPage(Menu)}
                  title="Geri"
                />
                <Input
                  type={InputType.Select}
                  label="Veri Türü"
                  onChange={(event: any) =>
                    this.setState({
                      ...this.state,
                      schema: this.state.schemas?.[event.target.value],
                      object: {},
                    })}
                >
                  {Object.keys(this.state.schemas ?? {}).map((key) => (
                    <option value={key}>
                      {this.state.schemas?.[key].title}
                    </option>
                  ))}
                </Input>
              </nav>
            )}
          </Page.Consumer>
          <section class="box">
            <h1>Düzenleyici</h1>

            {this.state.schemas
              ? (
                <Field
                  schema={this.state.schema ?? {}}
                  value={this.state.object}
                  onChange={(v) => this.setState({ ...this.state, object: v })}
                />
              )
              : (
                <div class="loader">
                  <div />
                </div>
              )}
          </section>
        </div>

        <div class="side">
          <Json
            object={this.state.object}
          />
        </div>
      </div>
    );
  }
}
