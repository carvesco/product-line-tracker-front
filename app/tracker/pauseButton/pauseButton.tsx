import axios from "axios";
import "./pauseButton.css";

const API_BASE_URL = import.meta.env.VITE_BACKENDURL || "http://localhost:3000";
const PauseButton = ({
  setIsPaused,
}: {
  setIsPaused: (paused: boolean) => void;
}) => {
  const handlePause = async () => {
    const loginId = localStorage.getItem("loginId");
    const buildNumber = localStorage.getItem("buildNumber");
    await axios.post(`${API_BASE_URL}/session/pause`, {
      loginId,
      buildNumber,
    });
    setIsPaused(true);
  };
  return (
    <button className="pause-button" onClick={handlePause}>
      PAUSE
    </button>
  );
};

export default PauseButton;
