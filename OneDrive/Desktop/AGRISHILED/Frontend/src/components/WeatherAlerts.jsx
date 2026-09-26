import { useState, useEffect } from "react";
import { CloudRain } from "lucide-react";

function WeatherAlerts() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/weather")
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, []);

  if (!weather) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-gray-800">Weather & Alerts</p>
        <p className="text-sm text-green-600 font-medium cursor-pointer">View All</p>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <CloudRain className="text-blue-500" size={32} />
        <p className="font-bold text-red-600">{weather.title}</p>
      </div>

      <p className="text-sm text-gray-700 mb-1">{weather.dateRange}</p>
      <p className="text-sm text-gray-500 mb-3">{weather.description}</p>
      <p className="text-sm text-green-600 font-medium cursor-pointer">View Details</p>
    </div>
  );
}

export default WeatherAlerts;