import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AirQualityDashboard() {
  const [data, setData] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://device.iqair.com/v2/615a7c9dfaff014e1bc81f1f");
        const json = await response.json();
        const d = json.current;
        setData({
          aqi: d.aqius,
          level: getAqiLevel(d.aqius),
          emoji: getAqiEmoji(d.aqius),
          pm10: d.pm10.conc,
          pm2_5: d.pm25.conc,
          pm1: d.pm1.conc,
          co2: d.co2,
          temp: d.tp,
          humidity: d.hm,
          pressure: d.pr / 100,
        });
        setLastUpdated(new Date(d.ts));

        setHourly(
          json.historical.hourly.slice(0, 12).reverse().map((h) => ({
            time: new Date(h.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            aqi: h.pm25.aqius,
            color: getAqiHex(h.pm25.aqius),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="p-4 text-white">Loading...</div>;

  const bgColor = getAqiColor(data.aqi);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-white bg-[#121826] min-h-screen">
      <Card className={`${bgColor} text-black col-span-1`}>
        <CardContent className="p-6">
          <div className="text-6xl mb-2">{data.emoji}</div>
          <div className="text-lg font-semibold mb-2">Air quality</div>
          <div className="text-5xl font-bold mb-1">{data.level}</div>
          <div className="text-3xl font-bold mb-2">{data.aqi} <span className="text-base font-normal">US AQI</span></div>
          <div className="text-sm text-gray-800 mb-4">Last updated: {lastUpdated?.toLocaleTimeString()}</div>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly}>
                <XAxis dataKey="time" stroke="#333" fontSize={10} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="aqi">
                  {hourly.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1F2937] col-span-2">
        <CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
          <Metric label="PM2.5 µg/m³" value={data.pm2_5} color="yellow" />
          <Metric label="PM10 µg/m³" value={data.pm10} color="green" />
          <Metric label="PM1 µg/m³" value={data.pm1} color="yellow" />
          <Metric label="CO₂ ppm" value={data.co2} color="green" />
          <Metric label="Temp. °C" value={data.temp} color="red" />
          <Metric label="Humidity %" value={data.humidity} color="yellow" />
          <Metric label="Pressure mb" value={data.pressure.toFixed(1)} />
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value, color = "white" }) {
  const colorMap = {
    yellow: "text-yellow-400",
    green: "text-green-400",
    red: "text-red-400",
    white: "text-white"
  };
  return (
    <div>
      <div className="text-sm text-gray-400">{label}</div>
      <div className={`text-2xl font-semibold ${colorMap[color]}`}>{value}</div>
    </div>
  );
}

function getAqiLevel(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function getAqiEmoji(aqi) {
  if (aqi <= 50) return "😄";
  if (aqi <= 100) return "🙂";
  if (aqi <= 150) return "🙁";
  if (aqi <= 200) return "😷";
  if (aqi <= 300) return "🤕";
  return "☢️";
}

function getAqiColor(aqi) {
  if (aqi <= 50) return "bg-green-300";
  if (aqi <= 100) return "bg-yellow-300";
  if (aqi <= 150) return "bg-orange-300";
  if (aqi <= 200) return "bg-red-300";
  if (aqi <= 300) return "bg-purple-300";
  return "bg-pink-300";
}

function getAqiHex(aqi) {
  if (aqi <= 50) return "#86efac";      // green
  if (aqi <= 100) return "#fde68a";     // yellow
  if (aqi <= 150) return "#fdba74";     // orange
  if (aqi <= 200) return "#fca5a5";     // red
  if (aqi <= 300) return "#c4b5fd";     // purple
  return "#f9a8d4";                      // pink
}