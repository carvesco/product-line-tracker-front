import axios from "axios";
import "./pauseButton.css";
const PauseButton = ({
  setIsPaused,
}: {
  setIsPaused: (paused: boolean) => void;
}) => {
  const handlePause = async () => {
    const loginId = localStorage.getItem("loginId");
    const buildNumber = localStorage.getItem("buildNumber");
    await axios.post("http://localhost:3000/session/pause", {
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
