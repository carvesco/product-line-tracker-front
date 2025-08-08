import {
  Form,
  type ActionFunction,
  useActionData,
  useNavigation,
  NavLink,
  useNavigate,
} from "react-router";
import "./login.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKENDURL || "http://localhost:3000";
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
    let res = await axios.post(`${API_BASE_URL}/session/`, {
      loginId,
      buildNumber,
    });
    buildData = {
      loginId: loginId,
      buildNumber: buildNumber,
      numberOfParts: res.data.buildData.numberOfParts,
      timePerPart: res.data.buildData.timePerPart,
    };
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
  const navigate = useNavigate();

  // Check if form is being submitted
  const isSubmitting = navigation.state === "submitting";

  // Check if a session is active
  const getSession = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/session/active`);
      if (response?.data?.session?.isActive) {
        console.log(response.data);

        localStorage.setItem("loginId", response.data.session.loginId || "");
        localStorage.setItem(
          "buildNumber",
          response.data.session.buildNumber?.toString() || ""
        );
        localStorage.setItem(
          "numberOfParts",
          response.data.buildData?.numberOfParts?.toString() || ""
        );
        localStorage.setItem(
          "timePerPart",
          response.data.buildData?.timePerPart?.toString() || ""
        );
        navigate("/tracker");
      }
      return;
    } catch (error) {
      console.error("Error fetching session:", error);
      return;
    }
  };
  useEffect(() => {
    getSession();
  }, []);

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
  const handleStartClick = async () => {
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
    try {
      // Notify backend that session has started
      await axios.post(`${API_BASE_URL}/session/start`, {
        loginId: buildData?.loginId,
        buildNumber: buildData?.buildNumber,
      });
      console.log("Session started successfully");
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Build Data</h3>
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
      </div>
    </div>
  );
};

export default login;
