import { Component } from "preact";

import { Page } from "@app/lib/context.ts";
import Editor from "@app/pages/editor/editor.tsx";
import Button, { ButtonIcon } from "@app/components/button/button.tsx";

import "./menu.less";

export default class Menu extends Component {
  render() {
    return (
      <div id="menu" class="box">
        <header>
          <h3>AAL TEBİGEP</h3>
          <h1>Veri Düzenleyici</h1>
          <h5>(Demo)</h5>
        </header>

        <Page.Consumer>
          {({ setPage }) => (
            <nav>
              <Button icon={ButtonIcon.Create} onClick={() => setPage(Editor)}>
              </Button>
            </nav>
          )}
        </Page.Consumer>
      </div>
    );
  }
}
