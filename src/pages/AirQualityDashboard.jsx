import React, { useEffect, useState } from "react";

export default function AirQualityDashboard() {
  const [aqi, setAqi] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const AQI_LEVELS = [
    { max: 50, label: "Good 😄", color: "#A8E05F" },
    { max: 100, label: "Moderate 🙂", color: "#FDD74B" },
    { max: 150, label: "Unhealthy (Sensitive) 🙁", color: "#FE9B57" },
    { max: 200, label: "Unhealthy 😷", color: "#FE6A69" },
    { max: 300, label: "Very Unhealthy 🤕", color: "#A97ABC" },
    { max: 500, label: "Hazardous ☢️", color: "#A87383" }
  ];

  const getAQILevel = (value) => {
    return AQI_LEVELS.find(level => value <= level.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
  };

  const fetchData = async () => {
    try {
      const res = await fetch("https://device.iqair.com/v2/615a7c9dfaff014e1bc81f1f");
      const data = await res.json();
      setAqi(data.current.aqius);
      setLastUpdated(new Date(data.current.ts).toLocaleString());
    } catch (err) {
      console.error("Error fetching AQI data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // auto-refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  if (aqi === null) return <div className="text-white text-center p-10">Loading...</div>;

  const { label, color } = getAQILevel(aqi);

  return (
    <div style={{ backgroundColor: color }} className="min-h-screen flex flex-col items-center justify-center text-white text-center p-10 transition-colors duration-500">
      <h1 className="text-3xl font-bold mb-4">Air Quality Index (AQI)</h1>
      <div className="text-[6rem]">{label}</div>
      <p className="text-xl mt-4">AQI: <span className="font-bold text-4xl">{aqi}</span></p>
      <p className="mt-4 text-sm">Last updated: {lastUpdated}</p>
    </div>
  );
}