import React, { useEffect, useState } from "react";

export default function AirQualityDashboard() {
  const [aqi, setAqi] = useState(null);

  useEffect(() => {
    fetch("https://device.iqair.com/v2/615a7c9dfaff014e1bc81f1f")
      .then((res) => res.json())
      .then((data) => setAqi(data.current.aqius));
  }, []);

  if (aqi === null) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="text-white text-center p-10">
      <h1 className="text-3xl font-bold mb-4">Air Quality Index</h1>
      <p className="text-6xl">{aqi}</p>
    </div>
  );
}