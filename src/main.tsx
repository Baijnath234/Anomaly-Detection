import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useRef } from "react";
import { Provider } from "react-redux";
import {store, persistor} from './features/common/store';  
import { BrowserRouter as Route } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import App from "./App";
import "./index.css";
// import * as serviceWorker from './serviceWorker';

const AppWrapper = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Route>
        <div
          ref={ref}
          style={{ display: "flex", height: "100%", width: "100%" }}
        >
          <App />
        </div>
      </Route>
      </PersistGate>
      </Provider>
    </>
  );
};

createRoot(document.getElementById("app") || document.body).render(
  <AppWrapper />
);

// Register the service worker if you want offline capabilities.
// serviceWorker.unregister();
// Change to serviceWorker.register() for PWA
