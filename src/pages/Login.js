import "./Login.css";
import { useEffect, useState } from "react";
import PrimaryButton from "../components/PrimaryButton.js";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";
import config from "../config";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginState } = useAuth();
  const { isSigningIn, errorMessage } = loginState;
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

  const handleLogin = async () => {
    const result = await login(username, password);
    if (result.success) {
      navigate("/");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
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
                onClick={handleLogin}
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