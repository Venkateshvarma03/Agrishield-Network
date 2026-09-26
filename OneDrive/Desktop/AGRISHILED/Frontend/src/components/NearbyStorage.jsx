import { MapPin } from "lucide-react";

const storages = [
  { id: 1, name: "Shree Farmer Warehouse", distance: "2.4 km", capacity: "120 Quintals", type: "Dry Storage" },
  { id: 2, name: "Warangal Cold Storage", distance: "5.7 km", capacity: "80 Quintals", type: "Cold Storage" },
  { id: 3, name: "Mega Grain Storage", distance: "7.3 km", capacity: "200 Quintals", type: "Dry Storage" },
];

function NearbyStorage() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">

      <div className="flex justify-between items-center mb-6">
        <p className="font-semibold text-gray-800 text-lg">Nearby Storage & Services</p>
        <p className="text-sm text-green-600 font-medium cursor-pointer">View All</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        
        {/* Left: map placeholder */}
        <div className="bg-gray-100 rounded-lg h-80 flex flex-col items-center justify-center gap-2">
          <MapPin className="text-gray-400" size={48} />
          <p className="text-sm text-gray-400">Map view coming soon</p>
        </div>

        {/* Right: storage list */}
        <div className="flex flex-col gap-5">
          {storages.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
              <div>
                <p className="font-medium text-gray-800 mb-1">{item.name}</p>
                <p className="text-xs text-gray-500 mb-0.5">{item.distance} • {item.capacity}</p>
                <p className="text-xs text-gray-500">{item.type}</p>
              </div>
              <button className="bg-green-600 text-white text-xs px-4 py-2 rounded-lg font-medium">
                Book Now
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default NearbyStorage;