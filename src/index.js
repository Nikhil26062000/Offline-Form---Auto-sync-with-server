import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import {
  deleteDataFromIndexedDB,
  fetchAllStoresWithValues,
  getAllDataFromIndexedDB,
  getAllStoreNames,
} from "./utils/indexedDB";
import { ConnectivityProvider } from "./context/connectivityContext";








const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
 
  <ConnectivityProvider>
    <App />
    </ConnectivityProvider>

);

// Enable service worker for offline functionality
serviceWorkerRegistration.register();

// Measure app performance
reportWebVitals();


