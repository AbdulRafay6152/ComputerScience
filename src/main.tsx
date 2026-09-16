import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Initialize Firebase and sync data
const initFirebase = async () => {
  try {
    console.log('🔥 Starting Firebase initialization...');
    const { initializeFirebase, setupRealtimeSync } = await import("./lib/firebaseStore");
    const { syncFromFirebase } = await import("./lib/store");
    
    await initializeFirebase();
    console.log('✅ Firebase initialized');
    
    console.log('🔄 Syncing data from Firebase...');
    await syncFromFirebase();
    console.log('✅ Data synced from Firebase');
    
    setupRealtimeSync();
    console.log('✅ Real-time sync active');
    
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
};

initFirebase();

// Render app
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
