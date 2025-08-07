import {
  Form,
  type ActionFunction,
  useActionData,
  useNavigation,
  NavLink,
} from "react-router";
import "./login.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const loginId = formData.get("LoginId");
  const buildNumber = Number(formData.get("buildNumber"));

  console.log("Login attempt:", { loginId, buildNumber });
  let buildData;
  if (!loginId || !buildNumber) {
    return { error: "Please fill in all fields" };
  }
  try {
    let res = await axios.post("http://localhost:3000/session/", {
      loginId,
      buildNumber,
    });
    console.log("Received response from server:", res.data);
    buildData = {
      loginId: loginId,
      buildNumber: buildNumber,
      numberOfParts: res.data.buildData.number_of_parts,
      timePerPart: res.data.buildData.time_per_part,
    };
    console.log("Received build data:", buildData);
  } catch (error) {
    console.error("Error during login:", error);
    return { error: "Login failed. Please try again." };
  }
  return { success: true, showModal: true, buildData };
};

const login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buildData, setBuildData] = useState(null);
  const actionData = useActionData() as any;
  const navigation = useNavigation();

  // Check if form is being submitted
  const isSubmitting = navigation.state === "submitting";

  // Open modal when action returns success
  useEffect(() => {
    if (actionData?.showModal) {
      setIsModalOpen(true);
      setBuildData(actionData.buildData);
    }
  }, [actionData]);

  return (
    <div className="login-container">
      <h1>Welcome</h1>
      <p>This is the login page to the Product Line Tracker application.</p>
      <Form className="login-form" method="post">
        <h2>Login ID</h2>
        <input
          className="input-field"
          name="LoginId"
          type="text"
          disabled={isSubmitting}
        />
        <h2>Build Number</h2>
        <input
          className="input-field"
          name="buildNumber"
          type="text"
          disabled={isSubmitting}
        />
        <button className="submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <span className="loader"></span> : "Login"}
        </button>
      </Form>
      {isSubmitting && (
        <div className="loading-indicator">
          <p>Processing your request...</p>
        </div>
      )}
      {isModalOpen && (
        <BuildDataModal
          onClose={() => setIsModalOpen(false)}
          buildData={buildData}
        />
      )}
      {actionData?.error && (
        <div className="error-message">{actionData.error}</div>
      )}
    </div>
  );
};

const BuildDataModal = ({
  onClose,
  buildData,
}: {
  onClose: () => void;
  buildData: any;
}) => {
  const handleStartClick = () => {
    // Save to localStorage
    localStorage.setItem("loginId", buildData?.loginId || "");
    localStorage.setItem(
      "buildNumber",
      buildData?.buildNumber?.toString() || ""
    );
    localStorage.setItem(
      "numberOfParts",
      buildData?.numberOfParts?.toString() || ""
    );
    localStorage.setItem(
      "timePerPart",
      buildData?.timePerPart?.toString() || ""
    );
  };
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Build Data</h2>
        <p>Build Number: {buildData?.buildNumber}</p>
        <p>Number of Parts: {buildData?.numberOfParts}</p>
        <p>Time per Part: {buildData?.timePerPart}</p>
        <NavLink
          className="start-button"
          to="/tracker"
          onClick={handleStartClick}
        >
          Start
        </NavLink>
        {/*         <button onClick={onClose}>Close</button> */}
      </div>
    </div>
  );
};

export default login;
