import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AirQualityDashboard from "./pages/AirQualityDashboard.js"; // <-- this is the fix

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AirQualityDashboard />
  </React.StrictMode>
);