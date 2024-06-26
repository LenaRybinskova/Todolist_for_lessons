import React from "react";
import "./AppWithRedux/index.css";
import { createRoot } from "react-dom/client";
import * as serviceWorker from "./serviceWorker";
import App from "./AppWithRedux/App";
import { Provider } from "react-redux";
import { store } from "./AppWithRedux/store";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
