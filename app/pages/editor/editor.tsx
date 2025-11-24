import { Component } from "preact";

import { Page } from "@app/lib/context.ts";
import Json from "@app/components/json/json.tsx";
import Menu from "@app/pages/menu/menu.tsx";
import Button, { ButtonIcon } from "@app/components/button/button.tsx";
import Select from "@app/components/select/select.tsx";

import "./editor.less";

interface State {
  schemas: { [key: string]: any };
  object: { [key: string]: any };
}

export default class Editor
  extends Component<Record<PropertyKey, never>, State> {
  constructor() {
    super();
    this.state = {
      schemas: {},
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
      this.setState({ ...this.state, schemas: result });
    } catch (e: any) {
      console.error(e.message);
    }
  }

  updateObject = (key: string, value: any) => {
    const obj = this.state.object;
    obj[key] = value;
    this.setState({ ...this.state, object: obj });
  };

  render() {
    return (
      <div id="editor">
        <div class="side">
          <Page.Consumer>
            {({ setPage }) => (
              <nav class="box">
                <Button
                  icon={ButtonIcon.Create}
                  onClick={() => setPage(Menu)}
                />
                <Select>
                  {Object.keys(this.state.schemas).map((key) => (
                    <option value={key} key={key}>
                      {this.state.schemas[key].title}
                    </option>
                  ))}
                </Select>
              </nav>
            )}
          </Page.Consumer>
          <div class="box">
            <h1>Düzenleyici</h1>
          </div>
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
