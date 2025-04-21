import React, { useEffect, useState } from "react";

const formatTime = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
};

const SessionTimer = ({ isRunning, resetSignal }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (resetSignal) setSeconds(0);
  }, [resetSignal]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <p className="mt-2 text-lg font-medium text-gray-600">
      Workout Time: <span className="font-bold text-indigo-600">{formatTime(seconds)}</span>
    </p>
  );
};

export default SessionTimer;