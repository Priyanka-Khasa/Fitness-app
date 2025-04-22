const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const { router: authRoutes, authMiddleware } = require("./routes/auth");
const Session = require("./models/session");

const app = express();
dotenv.config();

// 🌐 Middleware
app.use(cors());
app.use(express.json());

// 🛠️ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// 🔐 Auth Routes
app.use("/api/auth", authRoutes);

// 📊 Protected Session Routes
app.get("/api/sessions", authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.userId }).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to get sessions" });
  }
});

app.post("/api/sessions", authMiddleware, async (req, res) => {
  try {
    const { exercise, reps, date } = req.body;
    const newSession = new Session({ exercise, userId: req.userId, reps, date });
    await newSession.save();
    res.json({ message: "Session saved!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save session" });
  }
});

app.delete("/api/sessions", authMiddleware, async (req, res) => {
  try {
    await Session.deleteMany({ userId: req.userId });
    res.json({ message: "All sessions deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete sessions" });
  }
});

// ✅ Optional: Basic route to confirm backend is alive
app.get("/", (req, res) => {
  res.send("🎉 AI Fitness Backend is Running!");
});

// // 🌐 For serving frontend (optional, if you're building together)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "dist"))); // or 'client/dist' based on build output

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "dist", "index.html"));
//   });
// }

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
