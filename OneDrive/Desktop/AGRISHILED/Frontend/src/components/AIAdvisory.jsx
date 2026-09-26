import { useState } from "react";
import { CloudRain, Sparkles, Loader2 } from "lucide-react";

function AIAdvisory() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  // TODO: replace these hardcoded values with the farmer's actual selected
  // crop / district / location once that data is available in this component
  const cropContext = {
    commodity: "chilli",
    district: "Warangal",
    weightKg: 300,
    lat: 17.9689,
    lng: 79.5941,
  };

  const getRecommendation = async () => {
    setLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const res = await fetch("http://localhost:5000/api/agent/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cropContext),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Something went wrong");
      }
      setRecommendation(data.recommendation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 rounded-xl border border-gray-200 p-4">

      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-gray-800">AI Advisory</p>
        <p className="text-sm text-green-600 font-medium cursor-pointer">View All</p>
      </div>

      <div className="flex items-start gap-2 mt-2">
        <CloudRain className="text-blue-500" size={40} />
        <div>
          <p className="text-gray-800">
            Heavy rain expected in your area in <span className="font-bold">2 days.</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            We recommend storing Paddy immediately to avoid damage.
          </p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium mt-3">
            Book Storage Now
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-start gap-2">
          <Sparkles className="text-green-600" size={40} />
          <div className="flex-1">
            <p className="text-gray-800 font-medium">
              Should you sell, store, or transport your {cropContext.commodity}?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Get a live recommendation based on current mandi prices, nearby
              cold storage, and transport availability.
            </p>

            <button
              onClick={getRecommendation}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium mt-3 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? "Thinking..." : "Get AI Recommendation"}
            </button>

            {error && (
              <p className="text-sm text-red-600 mt-2">
                Couldn't get a recommendation: {error}
              </p>
            )}

            {recommendation && (
              <div className="mt-3 bg-white border border-green-200 rounded-lg p-3">
                <p className="text-sm text-gray-800">{recommendation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default AIAdvisory;