import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  RouterProvider,
} from "react-router-dom";

import store from "./rdx/store.ts";
import { getAppRouter } from "./router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={getAppRouter()} />
    </Provider>
  </React.StrictMode>
);
