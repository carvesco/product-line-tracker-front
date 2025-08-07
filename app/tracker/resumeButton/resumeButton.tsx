import "./resumeButton.css";
import axios from "axios";

const ResumeButton = ({
  setIsPaused,
}: {
  setIsPaused: (paused: boolean) => void;
}) => {
  const handleResume = async () => {
    const loginId = localStorage.getItem("loginId");
    const buildNumber = localStorage.getItem("buildNumber");
    await axios.post("http://localhost:3000/session/resume", {
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
