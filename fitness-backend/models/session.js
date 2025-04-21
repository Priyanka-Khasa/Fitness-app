const mongoose = require("mongoose");
const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    exercise: String,
    reps: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true } // ✅ This adds createdAt and updatedAt automatically
);
module.exports = mongoose.model("Session", sessionSchema);
