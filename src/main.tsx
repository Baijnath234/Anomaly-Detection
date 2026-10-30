import { createRoot } from "react-dom/client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { store, persistor } from './features/common/store';  
import { BrowserRouter as Route } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30, // 30 seconds
    },
  },
});

const AppWrapper = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Route>
            <div
              ref={ref}
              style={{ display: "flex", height: "100%", width: "100%" }}
            >
              <App />
            </div>
          </Route>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

createRoot(document.getElementById("app") || document.body).render(
  <AppWrapper />
);
