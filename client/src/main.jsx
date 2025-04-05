import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "./components/ui/sonner";
import { useLoadUserQuery } from "./features/api/authApi";
import LoadingSpinner from "./components/LoadingSpinner";

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return isLoading ? <LoadingSpinner /> : <>{children}</>;
};

// Ensure createRoot is called only once
const container = document.getElementById("root");
if (!container.__root) {
  container.__root = ReactDOM.createRoot(container);
}

container.__root.render(
  <Provider store={appStore}>
    <Custom>
      <App />
      <Toaster />
    </Custom>
  </Provider>
);
