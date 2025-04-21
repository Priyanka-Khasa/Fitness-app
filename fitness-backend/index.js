// ✅ Final index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const { router: authRoutes, authMiddleware } = require("./routes/auth");
const Session = require("./models/session");

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);

// Protected session routes
app.get("/api/sessions",authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.userId }).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to get sessions" });
  }
});

app.post("/api/sessions",authMiddleware, async (req, res) => {
  try {
    const { exercise, reps, date } = req.body;
    const newSession = new Session({ exercise,userId: req.userId,  reps, date });
    await newSession.save();
    res.json({ message: "Session saved!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save session" });
  }
});

app.delete("/api/sessions",authMiddleware, async (req, res) => {
  try {
    await Session.deleteMany({ userId: req.userId });
    res.json({ message: "All sessions deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete sessions" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
