import React from "react";

const ExerciseButtons = ({ onSelect }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
      <button
        onClick={() => onSelect("squat")}
        className="bg-blue-600 hover:bg-blue-700 transition duration-300 px-6 py-3 text-white text-lg font-semibold rounded-xl shadow-md"
      >
        🏋️ Start Squats
      </button>
      <button
        onClick={() => onSelect("pushup")}
        className="bg-green-600 hover:bg-green-700 transition duration-300 px-6 py-3 text-white text-lg font-semibold rounded-xl shadow-md"
      >
        🤸 Start Push-Ups
      </button>
    </div>
  );
};

export default ExerciseButtons;
