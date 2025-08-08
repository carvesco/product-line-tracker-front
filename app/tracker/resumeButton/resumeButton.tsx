import "./resumeButton.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKENDURL || "http://localhost:3000";
const ResumeButton = ({
  setIsPaused,
}: {
  setIsPaused: (paused: boolean) => void;
}) => {
  const handleResume = async () => {
    const loginId = localStorage.getItem("loginId");
    const buildNumber = localStorage.getItem("buildNumber");
    await axios.post(`${API_BASE_URL}/session/resume`, {
      loginId,
      buildNumber,
    });
    setIsPaused(false);
  };
  return (
    <div className="resume-button-container">
      <button className="resume-button" onClick={handleResume}>
        RESUME
      </button>
    </div>
  );
};

export default ResumeButton;
