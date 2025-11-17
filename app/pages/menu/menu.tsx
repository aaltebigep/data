import { Component } from "preact";

import Json from "@app/components/json/json.tsx";

import "./menu.less";

export default class Menu extends Component {
  render() {
    return (
      <div id="menu" class="widget box">
        <header>
          <h3>AAL TEBİGEP</h3>
          <h1>Veri Düzenleyici</h1>
          <h5>(Demo)</h5>
        </header>
      </div>
    );
  }
}
