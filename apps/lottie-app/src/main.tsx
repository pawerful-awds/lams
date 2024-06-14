import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import store from "./rdx/store.ts";
import { syncQueueToState } from "./rdx/features/animations/actions.ts";
import { AppRoutes } from "./router";
import "./index.css";

registerSW({
  onNeedRefresh() {
    window.location.reload();
  },
  onOfflineReady() {
    console.log("Offline ready");
  },
});

// Try to sync queue (offline) to state
store.dispatch(syncQueueToState());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  </React.StrictMode>
);
