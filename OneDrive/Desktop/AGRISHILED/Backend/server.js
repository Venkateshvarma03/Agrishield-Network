require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Crop = require("./models/Crop");
const MarketPrice = require("./models/MarketPrice");
const Weather = require("./models/Weather");
const Scheme = require("./models/Scheme");
const User = require("./models/User");
const authMiddleware = require("./middleware/auth");
const axios = require("axios");
const Storage = require("./models/Storage");
const Transport = require("./models/Transport");
const multer = require("multer");
const FormData = require("form-data");

const app = express();
const PORT = process.env.PORT || 5000;
const upload = multer();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error ❌", err));

app.get("/", (req, res) => {
  res.send("AgriShield Network backend is running 🌱");
});

// ---------- Authentication ----------
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User created successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ message: "Login successful ✅", token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------- Crops ----------
app.get("/api/crops", async (req, res) => {
  const crops = await Crop.find();
  res.json(crops);
});

app.post("/api/crops", authMiddleware, async (req, res) => {
  const newCrop = new Crop(req.body);
  await newCrop.save();
  res.json(newCrop);
});

app.put("/api/crops/:id", authMiddleware, async (req, res) => {
  const updatedCrop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedCrop);
});

app.delete("/api/crops/:id", authMiddleware, async (req, res) => {
  await Crop.findByIdAndDelete(req.params.id);
  res.json({ message: "Crop deleted" });
});

// ---------- Market Prices ----------
app.get("/api/market-prices", async (req, res) => {
  const marketPrices = await MarketPrice.find();
  res.json(marketPrices);
});

app.get("/api/live-market-prices", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24`,
      {
        params: {
          "api-key": process.env.DATA_GOV_API_KEY,
          format: "json",
          limit: 20,
          "filters[State]": "Telangana",
          sort: "-Arrival_Date",
        },
      }
    );
    res.json(response.data.records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch live market prices", error: err.message });
  }
});

app.post("/api/market-prices", authMiddleware, async (req, res) => {
  const newPrice = new MarketPrice(req.body);
  await newPrice.save();
  res.json(newPrice);
});

app.put("/api/market-prices/:id", authMiddleware, async (req, res) => {
  const updated = await MarketPrice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/api/market-prices/:id", authMiddleware, async (req, res) => {
  await MarketPrice.findByIdAndDelete(req.params.id);
  res.json({ message: "Market price deleted" });
});

// ---------- Weather ----------
app.get("/api/weather", async (req, res) => {
  const weather = await Weather.findOne();
  res.json(weather);
});

// ---------- Government Schemes ----------
app.get("/api/govt-schemes", async (req, res) => {
  const schemes = await Scheme.find();
  res.json(schemes);
});

app.post("/api/govt-schemes", authMiddleware, async (req, res) => {
  const newScheme = new Scheme(req.body);
  await newScheme.save();
  res.json(newScheme);
});

app.put("/api/govt-schemes/:id", authMiddleware, async (req, res) => {
  const updated = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/api/govt-schemes/:id", authMiddleware, async (req, res) => {
  await Scheme.findByIdAndDelete(req.params.id);
  res.json({ message: "Scheme deleted" });
});

// ---------- Storage ----------
app.get("/api/storage", async (req, res) => {
  const storages = await Storage.find();
  res.json(storages);
});

app.post("/api/storage/:id/book", authMiddleware, async (req, res) => {
  const updated = await Storage.findByIdAndUpdate(req.params.id, { available: false }, { new: true });
  res.json(updated);
});

// ---------- Transport ----------
app.get("/api/transport", async (req, res) => {
  try {
    const { district } = req.query;
    const filter = district ? { district: new RegExp(district, "i") } : {};
    const transports = await Transport.find(filter);
    res.json(transports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transport data", error: err.message });
  }
});

// ---------- AI Agent Recommendation ----------
app.post("/api/agent/recommend", async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.AGENT_SERVICE_URL}/api/agent/recommend`,
      req.body
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Agent service unavailable", details: err.message });
  }
});

// ---------- Voice Assistant ----------
app.post("/api/voice/query", upload.single("audio"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("audio", req.file.buffer, {
      filename: "recording.webm",
      contentType: req.file.mimetype,
    });

    const response = await axios.post(
      `${process.env.AGENT_SERVICE_URL}/api/voice/query`,
      formData,
      { headers: formData.getHeaders() }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Voice service unavailable", details: err.message });
  }
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});