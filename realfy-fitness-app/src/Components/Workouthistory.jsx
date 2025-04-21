
// ✅ WorkoutHistory.jsx with Chart.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WorkoutHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sessions");
      setSessions(res.data);
      setLoading(false);
    } catch (err) {
      setError("❌ Failed to fetch sessions");
      setLoading(false);
    }
  };

  const deleteAllSessions = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all sessions?");
    if (!confirmDelete) return;
    try {
      await axios.delete("http://localhost:5000/api/sessions");
      alert("✅ All sessions deleted");
      fetchSessions();
    } catch (err) {
      alert("❌ Failed to delete sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (filter === "all") setFilteredSessions(sessions);
    else setFilteredSessions(sessions.filter((s) => s.exercise === filter));
  }, [filter, sessions]);

  // 📊 Chart Data Processing
  const chartData = () => {
    const grouped = {};
    filteredSessions.forEach((s) => {
      const date = new Date(s.date).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + s.reps;
    });

    return {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: "Total Reps",
          data: Object.values(grouped),
          backgroundColor: "#60a5fa",
        },
      ],
    };
  };

  return (
    <div className="mt-6 w-full max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Workout History</h2>

        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="pushup">Push-Ups</option>
            <option value="squat">Squats</option>
          </select>

          <button
            onClick={deleteAllSessions}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete All
          </button>
        </div>
      </div>

      {loading && <p>Loading sessions...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && filteredSessions.length === 0 && <p>No workout sessions found.</p>}

      {!loading && filteredSessions.length > 0 && (
        <>
          <div className="mb-6">
            <Bar data={chartData()} />
          </div>

          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Exercise</th>
                <th className="px-4 py-2 text-left">Reps</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session, idx) => (
                <tr key={session._id} className="border-t border-gray-300">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 capitalize">{session.exercise}</td>
                  <td className="px-4 py-2">{session.reps}</td>
                  <td className="px-4 py-2">
                    {new Date(session.date).toLocaleDateString()} — {new Date(session.date).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default WorkoutHistory;
