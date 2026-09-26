import React, { useState, useEffect } from "react";
import { Wheat, Sprout, Leaf } from "lucide-react";

const cropIcons = {
  paddy: Wheat,
  Maize: Sprout,
  "Red gram": Leaf,
};

// Default farmer location — replace later if you add real location data
const DEFAULT_DISTRICT = "Karimnagar";
const DEFAULT_LAT = 18.4386;
const DEFAULT_LNG = 79.1288;

export default function CropsOverview() {
  const [crops, setCrops] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [recommendations, setRecommendations] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/crops")
      .then((res) => res.json())
      .then((data) => setCrops(data));
  }, []);

  const handleSell = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/api/crops/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "Sold" }),
    })
      .then((res) => res.json())
      .then((updatedCrop) => {
        setCrops((prevCrops) =>
          prevCrops.map((crop) =>
            crop._id === updatedCrop._id ? updatedCrop : crop
          )
        );
      });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/api/crops/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }).then(() => {
      setCrops((prevCrops) => prevCrops.filter((crop) => crop._id !== id));
    });
  };

  const handleGetRecommendation = async (crop) => {
    if (loadingId !== null) return; // block if another request is already in progress

    setLoadingId(crop._id);
    setRecommendations((prev) => ({ ...prev, [crop._id]: null }));

    try {
      const res = await fetch("http://localhost:5000/api/agent/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commodity: crop.name,
          district: DEFAULT_DISTRICT,
          weightKg: parseFloat(crop.quantity) || 0,
          lat: DEFAULT_LAT,
          lng: DEFAULT_LNG,
        }),
      });
      const data = await res.json();
      setRecommendations((prev) => ({
        ...prev,
        [crop._id]: data.recommendation || data.error || "No recommendation available",
      }));
    } catch (err) {
      setRecommendations((prev) => ({
        ...prev,
        [crop._id]: "Couldn't reach the AI advisor. Please try again.",
      }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm p-4 mt-6">
      
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-gray-800">My Crops Overview</p>
        <p className="text-sm text-green-600 font-medium cursor-pointer">View All</p>
      </div>

      <table className="min-w-full text-left">
        <thead>
          <tr className="bg-gray-100 text-sm text-gray-600 w-full text-left">
            <th className="px-4 py-3 text-sm text-gray-500 font-medium">Crop</th>
            <th className="px-4 py-3 text-sm text-gray-500 font-medium">Quantity</th>
            <th className="px-4 py-3 text-sm text-gray-500 font-medium">Harvest Date</th>
            <th className="px-4 py-3 text-sm text-gray-500 font-medium">Market Price</th>
            <th className="px-4 py-3 text-sm text-gray-500 font-medium">Est. Revenue</th>
            <th className="px-4 py-3 text-sm text-gray-500 font-medium">Status</th>
            <th className="px-4 py-3 text-sm text-gray-500 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {crops.map((crop) => (
            <React.Fragment key={crop._id}>
              <tr className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {cropIcons[crop.name] && (
                      <>{React.createElement(cropIcons[crop.name], { className: "text-green-600", size: 18 })}</>
                    )}
                    <span>{crop.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{crop.quantity}</td>
                <td className="px-4 py-3">{crop.harvestDate}</td>

                <td className="px-4 py-3">
                  ₹{crop.price.toLocaleString("en-IN")}{" "}
                  <span className={crop.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {crop.change >= 0 ? `+${crop.change}%` : `${crop.change}%`}
                  </span>
                </td>

                <td className="px-4 py-3">₹{crop.EstRevenue.toLocaleString("en-IN")}</td>

                <td className="px-4 py-3">
                  <span className={
                    crop.status === "Ready to Sell"
                      ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium"
                      : crop.status === "Sold"
                      ? "bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
                      : "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                  }>
                    {crop.status}
                  </span>
                </td>

                <td className="px-4 py-3 flex flex-col gap-2">
                  <div className="flex gap-2">
                    {crop.status === "Ready to Sell" ? (
                      <button
                        onClick={() => handleSell(crop._id)}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        Sell Now
                      </button>
                    ) : crop.status === "Sold" ? (
                      <span className="text-xs text-gray-400">—</span>
                    ) : (
                      <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                        View
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(crop._id)}
                      className="text-red-500 text-xs font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </div>

                  <button
                    onClick={() => handleGetRecommendation(crop)}
                    disabled={loadingId !== null}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50"
                  >
                    {loadingId === crop._id ? "Analyzing..." : "AI Recommendation"}
                  </button>
                </td>
              </tr>

              {recommendations[crop._id] && (
                <tr>
                  <td colSpan="7" className="px-4 pb-4">
                    <div className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 text-sm p-3 rounded">
                      {recommendations[crop._id]}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}