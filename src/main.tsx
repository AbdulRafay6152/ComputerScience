import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Render app immediately
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

// Initialize Firebase in the background (non-blocking)
import("./lib/sync").then(({ initializeFirebase, syncFromFirebase, setupRealtimeSync }) => {
  initializeFirebase()
    .then(() => syncFromFirebase())
    .then(() => setupRealtimeSync())
    .then(() => console.log('✅ Firebase sync initialized'))
    .catch((error) => console.error('❌ Firebase initialization failed:', error));
}).catch((error) => console.error('❌ Failed to load sync module:', error));
