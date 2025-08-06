import {
  Form,
  redirect,
  type ActionFunction,
  useActionData,
  useNavigation,
  NavLink,
} from "react-router";
import "./login.css";
import { useState, useEffect } from "react";

// Export the action function outside the component
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const loginId = formData.get("LoginId");
  const buildNumber = formData.get("buildNumber");

  console.log("Login attempt:", { loginId, buildNumber });

  // Here you would typically:
  // 1. Validate the data
  // 2. Make API call to authenticate
  // 3. Handle success/error responses

  // Return data to trigger modal opening
  if (loginId && buildNumber) {
    return { success: true, showModal: true, loginId, buildNumber };
  }

  // Return error response if validation fails
  return { error: "Please fill in all fields" };
};

const login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const actionData = useActionData() as any;
  const navigation = useNavigation();

  // Check if form is being submitted
  const isSubmitting = navigation.state === "submitting";

  // Open modal when action returns success
  useEffect(() => {
    if (actionData?.showModal) {
      setIsModalOpen(true);
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
      {isModalOpen && <BuildDataModal onClose={() => setIsModalOpen(false)} />}
      {actionData?.error && (
        <div className="error-message">{actionData.error}</div>
      )}
    </div>
  );
};

const BuildDataModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Build Data</h2>
        <p>This modal will display build data.</p>
        <NavLink to="/tracker">Start</NavLink>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default login;
