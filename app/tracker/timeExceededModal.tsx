import { useEffect, useState } from "react";
import "./tracker.css";
import { NavLink } from "react-router";

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const timeExceededModal = ({
  onClose,
  nextStep,
  onNo,
  onTimeLimit,
  timeout = 30,
}: {
  onClose: () => void;
  nextStep: () => void;
  onNo: () => void;
  onTimeLimit: () => void;
  timeout?: number;
}) => {
  const [countdown, setCountdown] = useState(timeout);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    interval = setInterval(() => {
      setCountdown((prevTime) => {
        if (countdown <= 1) {
          onTimeLimit();
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Time Exceeded</h2>
        <h2>{formatTime(countdown)}</h2>
        <p>Time is up. Do you wish to continue?</p>
        <div className="modal-actions">
          <NavLink className="next-button" to="/submission" onClick={nextStep}>
            Yes
          </NavLink>
          <button onClick={onNo}>No</button>
        </div>
      </div>
    </div>
  );
};

export default timeExceededModal;
