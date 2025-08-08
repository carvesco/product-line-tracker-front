import { useEffect, useRef, useState } from "react";
import "./tracker.css";
import TimeExceededModal from "./timeExceededModal";
import { NavLink, useNavigate } from "react-router";
import axios from "axios";
import PauseButton from "./pauseButton/pauseButton";
import ResumeButton from "./resumeButton/resumeButton";
import { formatTime } from "./timeExceededModal";
const Tracker = () => {
  const TIMEOUT = 30;
  const navigate = useNavigate();
  const [timeExceeded, setTimeExceeded] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
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
  const exceededRequestSent = useRef(false);
  const ExceededTimeRequest = async () => {
    if (exceededRequestSent.current) {
      return;
    }

    exceededRequestSent.current = true;
    const loginId = localStorage.getItem("loginId") ?? "";
    const buildNumber = localStorage.getItem("buildNumber") ?? "";
    await axios.post("http://localhost:3000/session/exceeded", {
      loginId,
      buildNumber,
    });
  };

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
    setIsRunning(true);
    setDefects(Number(defects));
  }, []);
  //get remaining time from server
  useEffect(() => {
    if (buildData.loginId === "" || buildData.buildNumber === "") {
      return;
    }
    const getRemainingTime = async () => {
      try {
        let remainingTime = await axios.get(
          `http://localhost:3000/session/time-left?loginId=${buildData.loginId}&buildNumber=${buildData.buildNumber}`
        );
        setIsPaused(remainingTime.data.session.isPaused);
        setIsSessionActive(true);
        setTimeRemaining(Math.floor(remainingTime.data.timeLeft / 1000));
      } catch (error) {
        console.error("Error fetching remaining time:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      getRemainingTime();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [buildData.loginId, buildData.buildNumber, isPaused]);
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (timeExceeded) {
            return prevTime + 1;
          }
          if (prevTime <= 1) {
            ExceededTimeRequest();
            setTimeExceeded(true);
            setShowTimeModal(true);
            return prevTime + 1;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeRemaining]);
  // save defects to localStorage
  const handleNextStep = () => {
    localStorage.setItem("defects", defects.toString());
  };
  //Reschedule the time exceeded pop up
  const handleNo = () => {
    setShowTimeModal(false);
    const nextPopUp = setTimeout(() => {
      setShowTimeModal(true);
    }, TIMEOUT * 1000);
    return () => clearTimeout(nextPopUp);
  };
  //Automatic submission
  const handleAutomaticSubmission = async () => {
    const loginId = localStorage.getItem("loginId") ?? "";
    const buildNumber = localStorage.getItem("buildNumber") ?? "";
    const defects = localStorage.getItem("defects") ?? "0";
    await axios.post("http://localhost:3000/session/finish", {
      loginId,
      buildNumber,
      totalParts: 0,
      defects: Number(defects),
      submission: false,
    });
    setShowTimeModal(false);
    localStorage.clear();
    navigate("/");
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
          <div className={timeExceeded ? "time-exceeded" : "timer-container"}>
            {timeExceeded ? "-" : ""}
            {formatTime(timeRemaining)}
          </div>
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
              onClick={handleNextStep}
            >
              NEXT
            </NavLink>
          </div>
        </div>
      ) : (
        <div className="loader-container">
          <span className="loader"></span>
        </div>
      )}
      {isPaused && <ResumeButton setIsPaused={setIsPaused} />}
      {showTimeModal && (
        <TimeExceededModal
          onClose={() => setShowTimeModal(false)}
          nextStep={handleNextStep}
          onNo={handleNo}
          onTimeLimit={handleAutomaticSubmission}
          timeout={TIMEOUT}
        />
      )}
    </>
  );
};

export default Tracker;
