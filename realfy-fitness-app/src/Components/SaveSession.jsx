import React from "react";

const SaveSession = ({ exercise, reps }) => {
  const saveSession = () => {
    fetch("http://localhost:5000/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exercise, reps })
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Session Saved:", data))
      .catch((err) => console.error("❌ Error saving session:", err));
  };

  return (
    <button onClick={saveSession} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
      Save {exercise} Session ({reps} Reps)
    </button>
  );
};

export default SaveSession;
