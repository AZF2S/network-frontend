import "./Login.css";
import { authApi } from "../api";
import { useEffect, useState } from "react";
import PrimaryButton from "../components/PrimaryButton.js";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";
import config from "../config";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticated, setUser, setIsAdmin } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleInputFocus = (input, label) => {
      if (label) {
        label.classList.add("input-selected");
      }
    };

    const handleInputBlur = (input, label) => {
      if (!input || !label) return;

      if (input.value.length === 0) {
        label.classList.remove("input-selected");
      } else {
        if (input) input.style.borderColor = "#666";
        if (label) label.style.color = "#000000de";
        setErrorMessage("");
      }
    };

    // Cache references to DOM elements
    const emailInput = document.querySelector(".email-login-input");
    const passwordInput = document.querySelector(".password-login-input");
    const emailLabel = document.querySelector(".email-label");
    const passwordLabel = document.querySelector(".password-label");

    // Store event handler references for cleanup
    const emailFocusHandler = () => handleInputFocus(emailInput, emailLabel);
    const emailBlurHandler = () => handleInputBlur(emailInput, emailLabel);
    const passwordFocusHandler = () => handleInputFocus(passwordInput, passwordLabel);
    const passwordBlurHandler = () => handleInputBlur(passwordInput, passwordLabel);

    // Add event listeners with null checks
    if (emailInput && emailLabel) {
      emailInput.addEventListener("focus", emailFocusHandler);
      emailInput.addEventListener("blur", emailBlurHandler);
    }

    if (passwordInput && passwordLabel) {
      passwordInput.addEventListener("focus", passwordFocusHandler);
      passwordInput.addEventListener("blur", passwordBlurHandler);
    }

    // Proper cleanup on unmount
    return () => {
      if (emailInput && emailLabel) {
        emailInput.removeEventListener("focus", emailFocusHandler);
        emailInput.removeEventListener("blur", emailBlurHandler);
      }

      if (passwordInput && passwordLabel) {
        passwordInput.removeEventListener("focus", passwordFocusHandler);
        passwordInput.removeEventListener("blur", passwordBlurHandler);
      }
    };
  }, []);

  const loginAttempt = async () => {
    try {
      setIsSigningIn(true);
      setErrorMessage("");

      if (!username || !password) {
        setErrorMessage("Please enter both username and password");
        setIsSigningIn(false);
        return;
      }

      // Call the API with properly formatted object
      const data = { username, password };
      const response = await authApi.login(data);

      // Validate the response exists
      if (!response || !response.data) {
        console.error('Login response is invalid:', response);
        setErrorMessage("Unexpected server response. Please try again.");
        setIsSigningIn(false);
        return;
      }

      const loginResponse = response.data;

      if (!loginResponse.success) {
        setErrorMessage(loginResponse.message || "Login failed");
        setIsSigningIn(false);
        return;
      }

      // Check if user data exists in the response
      if (!loginResponse.user) {
        console.error('User data missing in login response');
        setErrorMessage("Login succeeded but user data is missing");
        setIsSigningIn(false);
        return;
      }

      // Validate admin status
      const isUserAdmin = Array.isArray(loginResponse.user.groupTitleArray) &&
          loginResponse.user.groupTitleArray.includes("administrators");

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        username: loginResponse.user.username,
        uid: loginResponse.user.uid,
        isAdmin: isUserAdmin
      }));

      // Update authentication state
      setIsAuthenticated(true);
      setUser(loginResponse.user);
      setIsAdmin(isUserAdmin);

      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      // Handle different error types appropriately
      if (error.response) {
        // Server responded with an error status code
        setErrorMessage(error.response.data?.message || "Invalid username or password");
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage("No response from server. Please try again later.");
      } else {
        // Error in setting up the request
        setErrorMessage(error.message || "An error occurred during login");
      }

      setIsAuthenticated(false);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // We intentionally don't await this promise here
      // since we're using UI state (isSigningIn) to manage the flow
      loginAttempt().catch(err => {
        console.error("Unhandled error in login process:", err);
        setIsSigningIn(false);
      });
    }
  };

  return (
      <div className="login-body">
        <h1>Log in</h1>
        <p>
          Don't have an account? <a href="/sign-up">Sign up</a>
        </p>
        <div className="mid-section">
          <label htmlFor="username" className="email-label">
            Username
          </label>
          <input
              type="text"
              id="username"
              className="email-login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
          />
          <label htmlFor="password" className="password-label">
            Password
          </label>
          <input
              type="password"
              id="password"
              className="password-login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
          />
          <div className="li-error-line">
            {errorMessage && (
                <p id="li-error-text" style={{ visibility: "visible" }}>
                  {errorMessage}
                </p>
            )}
            {!errorMessage && (
                <p id="li-error-text" style={{ visibility: "hidden" }}>
                  Invalid username and/or password
                </p>
            )}
          </div>
          <div className="login-options">
            <a
                href={`${config.PROTOCOL}forum.${config.DOMAIN_NO_HTTPS}/reset`}
                target="_blank"
                rel="noreferrer"
            >
              Forgot password
            </a>
            <PrimaryButton
                backgroundColor="#668c3c"
                text={isSigningIn ? "Signing in..." : "Log in"}
                onClick={() => {
                  if (!isSigningIn) {
                    // We intentionally don't await this promise here
                    // since we're using UI state (isSigningIn) to manage the flow
                    loginAttempt().catch(err => {
                      console.error("Unhandled error in login process:", err);
                      setIsSigningIn(false);
                    });
                  }
                }}
                disabled={isSigningIn}
            />
          </div>
          {isSigningIn && (
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <CircularProgress />
              </Box>
          )}
        </div>
      </div>
  );
}

export default Login;