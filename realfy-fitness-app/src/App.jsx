import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import PoseDetector from "./Components/PoseDetector";
import ExerciseButtons from "./Components/ExerciseButtons";
import WorkoutHistory from "./Components/WorkoutHistory";
import AuthForm from "./Components/AuthForm";
import { useTheme } from "./Context/ThemeContext";

function App() {
  const [user, setUser] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [viewHistory, setViewHistory] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("user");
    if (token && name) {
      setUser(name);
    }
  }, []);

  const handleAuthSuccess = (name) => {
    localStorage.setItem("user", name);
    setUser(name);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'text-white bg-gray-900' : 'text-black bg-gray-100'}`}>
      <Navbar isLoggedIn={!!user} onLogout={handleLogout} />

      <div className="max-w-5xl mx-auto mt-8 px-4 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold">Welcome, {user} 💪</h1>

        <button
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md"
          onClick={() => {
            setSelectedExercise(null);
            setViewHistory(true);
          }}
        >
          View Workout History
        </button>

        {!viewHistory && !selectedExercise && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 w-full max-w-4xl px-4">
  {/* Squats Card */}
  <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-xl p-6 flex flex-col items-center text-center shadow-md hover:scale-105 transition-all">
    <h2 className="text-xl font-bold mb-2">🏋️ Start Squats</h2>
    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
      Improve lower body strength with real-time feedback.
    </p>
    <button
      onClick={() => setSelectedExercise("squats")}
      className="mt-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Start
    </button>
  </div>

  {/* Push-Ups Card */}
  <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-xl p-6 flex flex-col items-center text-center shadow-md hover:scale-105 transition-all">
    <h2 className="text-xl font-bold mb-2">🤸‍♀️ Start Push-Ups</h2>
    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
      Boost upper body power with posture analysis.
    </p>
    <button
      onClick={() => setSelectedExercise("pushups")}
      className="mt-auto px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
    >
      Start
    </button>
  </div>
</div>

)}

        {!viewHistory && selectedExercise && (
          <PoseDetector selectedExercise={selectedExercise} />
        )}

        {viewHistory && <WorkoutHistory />}
      </div>
    </div>
  );
}

export default App;
