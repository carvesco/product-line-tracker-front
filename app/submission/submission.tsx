import { useNavigate } from "react-router";
import "./submission.css";
const Submission = () => {
  const navigate = useNavigate();

  return (
    <div className="submission-container">
      <h1>Submission</h1>
      <p>Enter the total amount of parts processed:</p>
      <input
        type="number"
        name="totalParts"
        placeholder="Total Parts Processed"
        className="input-field"
      />
      <div className="submission-actions">
        <button className="back-button" onClick={() => navigate("/tracker")}>
          Back
        </button>
        <button
          className="submit-button"
          onClick={() => alert("Submission button clicked!")}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Submission;
