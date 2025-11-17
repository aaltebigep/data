import { Component, render } from "preact";

import "@app/style/main.less";
import Menu from "@app/pages/menu/menu.tsx";
import { Page } from "@app/lib/context.ts";

class App extends Component {
  render() {
    return (
      <main>
        <Page.Provider value={Menu}>
          <Page.Consumer>
            {(P) => <P />}
          </Page.Consumer>
        </Page.Provider>
      </main>
    );
  }
}

render(<App />, document.getElementById("app")!);
