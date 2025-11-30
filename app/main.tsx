import { Component, ComponentType, render } from "preact";

import "@app/style/main.less";
import Menu from "@app/pages/menu/menu.tsx";
import { Page } from "@app/lib/context.ts";

interface State {
  page: ComponentType;
}

class App extends Component<Record<PropertyKey, never>, State> {
  constructor() {
    super();
    this.state = {
      page: Menu,
    };
  }

  setPage = (value: ComponentType) => {
    this.setState({ ...this.state, page: value });
  };

  render() {
    const P = this.state.page;

    return (
      <main>
        <Page.Provider value={{ page: P, setPage: this.setPage }}>
          <P />
        </Page.Provider>
      </main>
    );
  }
}

render(<App />, document.getElementById("app")!);
