import React from "react";
import ReactDOM from "react-dom/client";
import AnchoredVerse from "./AnchoredVerse.jsx";
import { syncStatusBar } from "./native";
import { installNativeReminders } from "./nativeReminders";

// App Store app only (both do nothing on the website).
syncStatusBar();
installNativeReminders();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AnchoredVerse />
  </React.StrictMode>
);
