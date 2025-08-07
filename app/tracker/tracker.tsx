import { useEffect, useState } from "react";
import "./tracker.css";
import TimeExceededModal from "./timeExceededModal";
import { NavLink } from "react-router";
import axios from "axios";
import PauseButton from "./pauseButton/pauseButton";
import ResumeButton from "./resumeButton/resumeButton";
const Tracker = () => {
  const [timeExceeded, setTimeExceeded] = useState(false);
  const [buildData, setBuildData] = useState({
    loginId: "",
    buildNumber: "",
    numberOfParts: "",
    timePerPart: "",
  });
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [defects, setDefects] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  //Get build data from localStorage
  useEffect(() => {
    const loginId = localStorage.getItem("loginId") ?? "";
    const buildNumber = localStorage.getItem("buildNumber") ?? "";
    const numberOfParts = localStorage.getItem("numberOfParts") ?? "";
    const timePerPart = localStorage.getItem("timePerPart") ?? "";
    const defects = localStorage.getItem("defects") ?? "0";

    setBuildData({
      loginId,
      buildNumber,
      numberOfParts,
      timePerPart,
    });
    setIsRunning(true); // Start the timer immediately
    setDefects(Number(defects));
  }, []);
  //get remaining time from server
  useEffect(() => {
    if (buildData.loginId === "" || buildData.buildNumber === "") {
      return; // Don't make request if data not loaded or missing
    }
    const getRemainingTime = async () => {
      try {
        let remainingTime = await axios.get(
          `http://localhost:3000/session/time-left?loginId=${buildData.loginId}&buildNumber=${buildData.buildNumber}`
        );
        setIsPaused(remainingTime.data.session.isPaused);
        setIsSessionActive(true);
        setTimeRemaining(Math.floor(remainingTime.data.timeLeft / 1000)); // Convert milliseconds to seconds
      } catch (error) {
        console.error("Error fetching remaining time:", error);
      }
    };

    getRemainingTime();
  }, [buildData.loginId, buildData.buildNumber, isPaused]);
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            setTimeExceeded(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimeExceeded = () => {
    setTimeExceeded(true);
  };
  return (
    <>
      <div className="tracker-header">
        <h3>Login ID: {buildData.loginId}</h3>
        <h3>Build Number: {buildData.buildNumber}</h3>
        <h3>Number of Parts: {buildData.numberOfParts}</h3>
        <h3>Time per Part: {buildData.timePerPart}</h3>
      </div>
      {isSessionActive ? (
        <div className="tracker-content">
          <div className="timer-container">{formatTime(timeRemaining)}</div>
          <div className="controls-container">
            <PauseButton setIsPaused={setIsPaused} />
            <input
              className="defects-input"
              type="number"
              placeholder="# of Defects"
              onChange={(e) => setDefects(Number(e.target.value))}
              value={defects}
            />
            <NavLink
              className="next-button"
              to="/submission"
              onClick={() => {
                localStorage.setItem("defects", defects.toString());
              }}
            >
              NEXT
            </NavLink>
          </div>
        </div>
      ) : (
        <span className="loader"></span>
      )}
      {isPaused && <ResumeButton setIsPaused={setIsPaused} />}
      {timeExceeded && (
        <TimeExceededModal onClose={() => setTimeExceeded(false)} />
      )}
    </>
  );
};

export default Tracker;
