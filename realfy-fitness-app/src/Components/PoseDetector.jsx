import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";
import SaveSession from "./SaveSession";
import OverlayModel from "./OverlayModel";
import SessionTimer from "./SessionTimer";

const calculateAngle = (A, B, C) => {
  const AB = { x: B.x - A.x, y: B.y - A.y };
  const CB = { x: B.x - C.x, y: B.y - C.y };
  const dot = AB.x * CB.x + AB.y * CB.y;
  const magAB = Math.sqrt(AB.x ** 2 + AB.y ** 2);
  const magCB = Math.sqrt(CB.x ** 2 + CB.y ** 2);
  return (Math.acos(dot / (magAB * magCB)) * 180) / Math.PI;
};

const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

const PoseDetector = ({ selectedExercise }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const animationRef = useRef(null);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState("Start exercising!");
  const [phase, setPhase] = useState(null);
  const lastSpoken = useRef("");
  const [isSaved, setIsSaved] = useState(false);
  const [borderColor, setBorderColor] = useState("gray");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);

  const handleReset = () => {
    setRepCount(0);
    setPhase(null);
    setFeedback("Start exercising!");
    lastSpoken.current = "";
    setIsSaved(false);
    setIsTimerRunning(false);
    setResetSignal(true);
    setTimeout(() => setResetSignal(false), 100);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    detectPose();
  };

  useEffect(() => {
    const loadLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm"
      );
      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });
      setPoseLandmarker(landmarker);
    };
    loadLandmarker();
  }, []);

  const detectPose = async () => {
    if (!poseLandmarker || !webcamRef.current || !canvasRef.current) return;
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const drawingUtils = new DrawingUtils(ctx);

    const detect = async () => {
      if (video.readyState === 4) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const result = await poseLandmarker.detectForVideo(video, performance.now());
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (result.landmarks.length > 0) {
          const lm = result.landmarks[0];
          let color = "green";
          let currentFeedback = "";

          if (!isTimerRunning) setIsTimerRunning(true);

          if (selectedExercise === "squat") {
            const angle = calculateAngle(lm[23], lm[25], lm[27]);
            color = angle < 100 ? "green" : "red";
            currentFeedback = angle < 100 ? "Squat Down" : "Go Lower!";
            if (angle < 100 && phase !== "down") setPhase("down");
            if (angle > 160 && phase === "down") {
              setPhase("up");
              setRepCount((prev) => prev + 1);
            }
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(lm[25].x * canvas.width, lm[25].y * canvas.height, 10, 0, 2 * Math.PI);
            ctx.fill();
          }

          if (selectedExercise === "pushup") {
            const angle = calculateAngle(lm[11], lm[13], lm[15]);
            color = angle > 160 ? "green" : "red";
            currentFeedback = angle < 90 ? "Push-Up Down" : "Go Deeper!";
            if (angle < 90 && phase !== "down") setPhase("down");
            if (angle > 160 && phase === "down") {
              setPhase("up");
              setRepCount((prev) => prev + 1);
            }
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(lm[13].x * canvas.width, lm[13].y * canvas.height, 10, 0, 2 * Math.PI);
            ctx.fill();
          }

          setBorderColor(color);
          setFeedback(currentFeedback);

          if (currentFeedback && currentFeedback !== lastSpoken.current) {
            speak(currentFeedback);
            lastSpoken.current = currentFeedback;
          }

          if (repCount > 0 && repCount % 10 === 0 && lastSpoken.current !== "Great job!") {
            speak("Great job!");
            lastSpoken.current = "Great job!";
          }

          if (repCount >= 30 && !isSaved) {
            setIsSaved(true);
            setFeedback("Workout Complete! 🎉");
            speak("Workout Complete!");
          }

          drawingUtils.drawLandmarks(lm);
          drawingUtils.drawConnectors(lm, PoseLandmarker.POSE_CONNECTIONS);
        }
      }
      animationRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  useEffect(() => {
    detectPose();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [poseLandmarker, selectedExercise]);

  return (
    <>
      <div className="text-center mt-6 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">AI Fitness Posture Evaluator</h1>
        <p className="text-sm text-gray-500 mt-1">Track your Squats and Push-Ups with Real-Time AI Feedback</p>
      </div>

      <div
        className={`relative mx-auto w-full max-w-[480px] aspect-video rounded-xl border-4 transition-all duration-300 ${
          borderColor === "green" ? "border-green-500 shadow-green-300" : "border-red-500 shadow-red-300"
        } shadow-xl`}
      >
        <Webcam ref={webcamRef} mirrored className="absolute top-0 left-0 w-full h-full rounded-xl object-cover z-0" />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-10" />
      </div>

      <div className="text-center mt-4">
        <p className="text-xl font-bold text-gray-800">Reps: {repCount}</p>
        <SessionTimer isRunning={isTimerRunning} resetSignal={resetSignal} />
        <div
          className={`mt-2 inline-block px-4 py-2 rounded-full font-semibold text-white text-sm shadow-md transition-all duration-300 animate-pulse ${
            borderColor === "green" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {feedback}
        </div>

        <button
          onClick={handleReset}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
        >
          Reset
        </button>
        <div className="mt-6">
         <OverlayModel />
        </div>

        <div className="mt-4">
          <SaveSession exercise={selectedExercise} reps={repCount} />
        </div>
      </div>
    </>
  );
};

export default PoseDetector;