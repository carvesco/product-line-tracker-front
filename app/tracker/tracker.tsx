import { useState } from "react";
import "./tracker.css";
import TimeExceededModal from "./timeExceededModal";
import { NavLink } from "react-router";
const Tracker = () => {
  const [timeExceeded, setTimeExceeded] = useState(false);
  const handleTimeExceeded = () => {
    setTimeExceeded(true);
  };
  return (
    <>
      <div className="tracker-header">
        <div className="header-section">
          <h1>Login ID:</h1>
          <h1>Build Number:</h1>
        </div>
        <div className="header-section">
          <h1>Number of Parts:</h1>
          <h1>Time per Part:</h1>
        </div>
      </div>
      <div className="tracker-content">
        <div className="timer-container">00:00:00</div>
        <div className="controls-container">
          <button className="pause-button">PAUSE</button>
          <input
            className="defects-input"
            type="number"
            placeholder="# of Defects"
          />
          <NavLink className="next-button" to="/submission">
            NEXT
          </NavLink>
          {/*  <button onClick={handleTimeExceeded} className="next-button">
            NEXT
          </button> */}
        </div>
      </div>
      {timeExceeded && (
        <TimeExceededModal onClose={() => setTimeExceeded(false)} />
      )}
    </>
  );
};

export default Tracker;
