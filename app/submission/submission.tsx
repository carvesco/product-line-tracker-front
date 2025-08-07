import { useNavigate } from "react-router";
import "./submission.css";
import { useState } from "react";
import axios from "axios";
const Submission = () => {
  const navigate = useNavigate();
  const [totalParts, setTotalParts] = useState(0);
  const handleSubmit = async (event: React.FormEvent) => {
    const loginId = localStorage.getItem("loginId") ?? "";
    const buildNumber = localStorage.getItem("buildNumber") ?? "";
    const defects = localStorage.getItem("defects") ?? "0";

    if (!totalParts) {
      alert("Please enter the total amount of parts processed.");
      return;
    }
    await axios.post("http://localhost:3000/session/finish", {
      loginId,
      buildNumber,
      totalParts,
      defects: Number(defects),
      submission: true,
    });
    navigate("/login");
  };

  return (
    <div className="submission-container">
      <h1>Submission</h1>
      <p>Enter the total amount of parts processed:</p>
      <input
        type="number"
        name="totalParts"
        placeholder="Total Parts Processed"
        className="input-field"
        value={totalParts}
        onChange={(e) => setTotalParts(Number(e.target.value))}
      />
      <div className="submission-actions">
        <button className="back-button" onClick={() => navigate("/tracker")}>
          Back
        </button>
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Submission;
