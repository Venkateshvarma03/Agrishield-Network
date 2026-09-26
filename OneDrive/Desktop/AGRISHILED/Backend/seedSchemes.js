require("dotenv").config();
const mongoose = require("mongoose");
const Scheme = require("./models/Scheme");

const schemes = [
  { iconName: "Landmark", title: "PM Kisan Samman Nidhi", titleColor: "text-gray-800", description: "₹6,000 per year", subDescription: "Direct benefit transfer", linkText: "Check Status", cardBg: "bg-orange-50" },
  { iconName: "ShieldCheck", title: "PM Fasal Bima Yojana", titleColor: "text-green-700", description: "Crop Insurance", subDescription: "Get financial support", linkText: "Apply Now", cardBg: "bg-green-50" },
  { iconName: "Building2", title: "Agriculture Infrastructure Fund", titleColor: "text-orange-600", description: "Get up to 3% interest subsidy", subDescription: "For storage & infrastructure", linkText: "Apply Now", cardBg: "bg-orange-50" },
  { iconName: "ShoppingCart", title: "e-NAM Marketplace", titleColor: "text-gray-800", description: "Sell directly to buyers", subDescription: "Better price discovery", linkText: "Explore", cardBg: "bg-green-50" },
  { iconName: "CreditCard", title: "Kisan Credit Card", titleColor: "text-orange-600", description: "Easy access to credit", subDescription: "Low interest loans", linkText: "Apply Now", cardBg: "bg-orange-50" },
  { iconName: "Sprout", title: "Soil Health Card", titleColor: "text-gray-800", description: "Free soil testing", subDescription: "Improve soil health", linkText: "Apply Now", cardBg: "bg-green-50" },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected ✅");
    await Scheme.deleteMany({});
    await Scheme.insertMany(schemes);
    console.log("Schemes seeded 🌱");
    mongoose.connection.close();
  })
  .catch((err) => console.log("Error ❌", err));