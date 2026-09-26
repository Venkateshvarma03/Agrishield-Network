import { useState, useEffect } from "react";
import { Landmark, ShieldCheck, Building2, ShoppingCart, CreditCard, Sprout } from "lucide-react";

const iconMap = {
  Landmark,
  ShieldCheck,
  Building2,
  ShoppingCart,
  CreditCard,
  Sprout,
};

function GovtSchemes() {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/govt-schemes")
      .then((res) => res.json())
      .then((data) => setSchemes(data));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/govt-schemes/${id}`, {
      method: "DELETE",
    }).then(() => {
      setSchemes((prev) => prev.filter((scheme) => scheme._id !== id));
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <p className="font-semibold text-gray-800 text-lg">Government Schemes & Benefits for You</p>
        <p className="text-sm text-green-600 font-medium cursor-pointer">View All</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {schemes.map((scheme) => {
          const Icon = iconMap[scheme.iconName];
          return (
            <div key={scheme._id} className={`${scheme.cardBg} rounded-xl p-4 relative`}>
              <button
                onClick={() => handleDelete(scheme._id)}
                className="absolute top-2 right-2 text-red-500 text-xs font-medium hover:underline"
              >
                Delete
              </button>
              {Icon && <Icon className="text-gray-600 mb-3" size={24} />}
              <p className={`font-semibold text-sm mb-2 ${scheme.titleColor}`}>{scheme.title}</p>
              <p className="text-xs text-gray-500">{scheme.description}</p>
              <p className="text-xs text-gray-500 mb-3">{scheme.subDescription}</p>
              <p className="text-xs text-green-600 font-semibold cursor-pointer">{scheme.linkText}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GovtSchemes;