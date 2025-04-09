import "./SignUp.css";
import config from "../config.js"
import {useEffect, useState} from "react";
import { authApi } from "../api";
import {useNavigate} from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton.js";
import {useAuth} from "../contexts/AuthContext";
import {Box, CircularProgress} from "@mui/material";
import updateForumSettings from "../utils/updateForumSettings";

function SignUp() {
  const [usernameString, setUsername] = useState("");
  const [emailString, setEmail] = useState("");
  const [passwordString, setPassword] = useState("");
  const [confirmPasswordString, setConfirmPassword] = useState("");
  const [, setTos] = useState(false);
  const [, setMailchimp] = useState(false);
  const {
    setIsAuthenticated,
    setUser
  } = useAuth();
  const [nameString, setName] = useState("");
  const [currentSection] = useState(1);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const navigate = useNavigate();

  let username,
      email,
      password,
      confirmPassword,
      name,
      usernameLabel,
      emailLabel,
      passwordLabel,
      confirmPasswordLabel,
      nameLabel,
      error

  useEffect(() => {
    window.scrollTo(0, 0);

    // DOM Element Selection
    const elements = {
      username: document.querySelector(".su-username-login-input"),
      email: document.querySelector(".su-email-login-input"),
      password: document.querySelector(".su-password-login-input"),
      confirmPassword: document.querySelector(".su-confirm-password"),
      name: document.querySelector(".su-name"),
      usernameLabel: document.querySelector(".su-username-label"),
      emailLabel: document.querySelector(".su-email-label"),
      passwordLabel: document.querySelector(".su-password-label"),
      confirmPasswordLabel: document.querySelector(".su-confirm-password-label"),
      nameLabel: document.querySelector(".su-name-label"),
      error: document.getElementById("su-error-text"),
      error2: document.getElementById("su-error-text2")
    };

    // Create safe event handlers with null checks
    const createFocusHandler = (input, label) => {
      return () => {
        if (label) {
          label.style.top = "10px";
          label.style["z-index"] = "2";
        }
      };
    };

    const createBlurHandler = (input, label, errorElement) => {
      return () => {
        if (!input || !label) return;

        if (input.value.length === 0) {
          label.style.top = "38px";
          label.style["z-index"] = "-1";
        } else {
          input.style.borderColor = "#666";
          label.style.color = "#000000de";
          if (errorElement) {
            errorElement.style.visibility = "hidden";
          }
        }
      };
    };

    // Add event listeners with null checks
    if (elements.username && elements.usernameLabel) {
      elements.username.addEventListener("focus", createFocusHandler(elements.username, elements.usernameLabel));
      elements.username.addEventListener("blur", createBlurHandler(elements.username, elements.usernameLabel, elements.error));
    }

    if (elements.email && elements.emailLabel) {
      elements.email.addEventListener("focus", createFocusHandler(elements.email, elements.emailLabel));
      elements.email.addEventListener("blur", createBlurHandler(elements.email, elements.emailLabel, elements.error));
    }

    if (elements.password && elements.passwordLabel) {
      elements.password.addEventListener("focus", createFocusHandler(elements.password, elements.passwordLabel));
      elements.password.addEventListener("blur", createBlurHandler(elements.password, elements.passwordLabel, elements.error));
    }

    if (elements.confirmPassword && elements.confirmPasswordLabel) {
      elements.confirmPassword.addEventListener("focus", createFocusHandler(elements.confirmPassword, elements.confirmPasswordLabel));
      elements.confirmPassword.addEventListener("blur", createBlurHandler(elements.confirmPassword, elements.confirmPasswordLabel, elements.error));
    }

    if (elements.name && elements.nameLabel) {
      elements.name.addEventListener("focus", createFocusHandler(elements.name, elements.nameLabel));
      elements.name.addEventListener("blur", createBlurHandler(elements.name, elements.nameLabel, elements.error2));
    }

    // Cleanup event listeners on unmount
    return () => {
      if (elements.username && elements.usernameLabel) {
        elements.username.removeEventListener("focus", createFocusHandler(elements.username, elements.usernameLabel));
        elements.username.removeEventListener("blur", createBlurHandler(elements.username, elements.usernameLabel, elements.error));
      }

      if (elements.email && elements.emailLabel) {
        elements.email.removeEventListener("focus", createFocusHandler(elements.email, elements.emailLabel));
        elements.email.removeEventListener("blur", createBlurHandler(elements.email, elements.emailLabel, elements.error));
      }

      if (elements.password && elements.passwordLabel) {
        elements.password.removeEventListener("focus", createFocusHandler(elements.password, elements.passwordLabel));
        elements.password.removeEventListener("blur", createBlurHandler(elements.password, elements.passwordLabel, elements.error));
      }

      if (elements.confirmPassword && elements.confirmPasswordLabel) {
        elements.confirmPassword.removeEventListener("focus", createFocusHandler(elements.confirmPassword, elements.confirmPasswordLabel));
        elements.confirmPassword.removeEventListener("blur", createBlurHandler(elements.confirmPassword, elements.confirmPasswordLabel, elements.error));
      }

      if (elements.name && elements.nameLabel) {
        elements.name.removeEventListener("focus", createFocusHandler(elements.name, elements.nameLabel));
        elements.name.removeEventListener("blur", createBlurHandler(elements.name, elements.nameLabel, elements.error2));
      }
    };
  }, []);

  // Starting point of page
  async function handleInput() {
    // Regular expressions
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const usernameAlphanumericRegex = /^[a-zA-Z0-9_]+$/;
    const passwordCharacterCountRegex = /^.{8,}$/;
    const passwordCapitalLetterRegex = /[A-Z]/;
    const passwordNumberSymbolRegex = /^(?=.*\d)(?=.*[-+_!@#$%^&*.,?])/;

    // DOM Element Selection
    name = document.querySelector(".su-name");
    username = document.querySelector(".su-username-login-input");
    email = document.querySelector(".su-email-login-input");
    password = document.querySelector(".su-password-login-input");
    confirmPassword = document.querySelector(".su-confirm-password");
    nameLabel = document.querySelector(".su-name-label");
    usernameLabel = document.querySelector(".su-username-label");
    emailLabel = document.querySelector(".su-email-label");
    passwordLabel = document.querySelector(".su-password-label");
    confirmPasswordLabel = document.querySelector(".su-confirm-password-label");
    error = document.getElementById("su-error-text");
    const tosCheckbox = document.querySelector('input[name="tos-check"]');
    const newsletterCheckbox = document.querySelector('input[name="newsletter-check"]');
    const adultCheckbox = document.querySelector('input[name="adult-check"]');

    // Handle empty fields
    if (
        nameString.length === 0 ||
        usernameString.length === 0 ||
        emailString.length === 0 ||
        passwordString.length === 0 ||
        confirmPasswordString.length === 0
    ) {
      if (nameString.length === 0) {
        name.style.borderColor = "#b50000";
        nameLabel.style.color = "#b50000";
      }
      if (usernameString.length === 0) {
        username.style.borderColor = "#b50000";
        usernameLabel.style.color = "#b50000";
      }
      if (emailString.length === 0) {
        email.style.borderColor = "#b50000";
        emailLabel.style.color = "#b50000";
      }
      if (passwordString.length === 0) {
        password.style.borderColor = "#b50000";
        passwordLabel.style.color = "#b50000";
      }
      if (confirmPasswordString.length === 0) {
        confirmPassword.style.borderColor = "#b50000";
        confirmPasswordLabel.style.color = "#b50000";
      }
      error.style.visibility = "visible";
      error.innerHTML = "Please fill out all required fields.";
      return;
    }

    // Handle non-alphanumeric username
    if (!usernameAlphanumericRegex.test(usernameString)) {
      username.style.borderColor = "#b50000";
      usernameLabel.style.color = "#b50000";
      error.style.visibility = "visible";
      error.innerHTML = "Usernames can only contain letters, numbers, and underscores.";
      return;
    }

    // Handle invalid email
    if (!emailRegex.test(emailString)) {
      email.style.borderColor = "#b50000";
      emailLabel.style.color = "#b50000";
      error.style.visibility = "visible";
      error.innerHTML = "Please enter a valid email address.";
      return;
    }

    // Handle invalid password
    if (!passwordCharacterCountRegex.test(passwordString)) {
      password.style.borderColor = "#b50000";
      passwordLabel.style.color = "#b50000";
      error.style.visibility = "visible";
      error.innerHTML = "Please enter a password with at least 8 characters.";
      return;
    }

    if (!passwordCapitalLetterRegex.test(passwordString)) {
      password.style.borderColor = "#b50000";
      passwordLabel.style.color = "#b50000";
      error.style.visibility = "visible";
      error.innerHTML = "Please enter a password with at least 1 capital letter.";
      return;
    }

    if (!passwordNumberSymbolRegex.test(passwordString)) {
      password.style.borderColor = "#b50000";
      passwordLabel.style.color = "#b50000";
      error.style.visibility = "visible";
      error.innerHTML = "Please enter a password with at least 1 number and 1 symbol.";
      return;
    }

    // Handle passwords do not match
    if (passwordString !== confirmPasswordString) {
      confirmPassword.style.borderColor = "#b50000";
      confirmPasswordLabel.style.color = "#b50000";
      error.style.visibility = "visible";
      error.innerHTML = "Please make sure your passwords match.";
      return;
    }

    // Handle didn't agree to terms of service
    if (!tosCheckbox.checked) {
      tosCheckbox.style.borderColor = "#b50000";
      error.style.visibility = "visible";
      error.innerHTML = "Please agree to our Terms of Service and Privacy Policy to continue.";
      return;
    }

    if (!adultCheckbox.checked) {
      adultCheckbox.style.borderColor = "#b50000";
      error.style.visibility = "visible";
      error.innerHTML = "Please verify that you are at least 18 years of age.";
      return;
    }

    // Success, generating account...
    console.log("Passed field validation.");
    error.style.visibility = "hidden";

    try {
      setIsSigningIn(true);

      // 1. Check account availability
      const availability = await checkAvailability(
          usernameString,
          emailString
      );

      if (availability === 200) {
        console.log("Account is available.");

        // 2. Create new account object with NodeBB API
        const signUpResponse = await handleSignUp(
            usernameString,
            passwordString,
            emailString
        );

        if (signUpResponse && signUpResponse.uid && signUpResponse.uid > 1) {
          console.log("Account created successfully.");

          // 3. Log the user into their account
          const loginResponse = await handleLogIn(usernameString, passwordString);
          if (loginResponse && loginResponse > 1) {
            console.log("Client auth established");

            // 4. Add custom fields to their account object
            const customObjectResponse = await upsertCustomFields(
                signUpResponse.uid,
                nameString,
                emailString,
                newsletterCheckbox.checked
            );

            if (customObjectResponse && customObjectResponse.status === 200) {
              console.log("Custom fields added.");

              if (customObjectResponse.data && customObjectResponse.data.user) {
                setUser(customObjectResponse.data.user);
                console.log("Local cookie set.");
              }

              // 5. Update NodeBB settings to the default values
              await upsertForumFields(signUpResponse.uid);
              console.log("Set default privacy settings.");

              // 6. Notify admin team
              await sendEmail(nameString, usernameString, emailString);
              console.log("Notified admin");

              navigate("/getting-started");
            } else {
              // Custom objects failed
              error.style.visibility = "visible";
              error.innerHTML = "Account creation failed. Please contact support@azfarmtoschool.org";
            }
          } else {
            // Login failed
            error.style.visibility = "visible";
            error.innerHTML = "Account creation failed. Please contact support@azfarmtoschool.org";
          }
        } else {
          // NodeBB signup failed
          error.style.visibility = "visible";
          error.innerHTML = "Account creation failed. Please try again in a few minutes, or contact support@azfarmtoschool.org if issues persist.";
        }
      } else {
        // Account not available
        error.style.visibility = "visible";
        error.innerHTML = "Username or email is already taken.";
      }
    } catch (err) {
      console.error("Error in signup process:", err);
      error.style.visibility = "visible";
      error.innerHTML = `Account creation failed. Please contact support@azfarmtoschool.org`;
    } finally {
      setIsSigningIn(false);
    }
  }

  async function checkAvailability(usernameString, emailString) {
    try {
      // Create a proper object to match backend expectations
      const data = {
        username: usernameString,
        email: emailString
      };

      // Make API call with the object
      const response = await authApi.checkAccountAvailable(data);
      return response.status;
    } catch (error) {
      console.error('Error checking account availability:', error);
      return error.response ? error.response.status : 500;
    }
  }

  async function handleSignUp(username, password, email) {
    try {
      // Object format for backend expectations
      const response = await authApi.signUp({
        username,
        password,
        email
      });

      if (!response || !response.data) {
        console.error('Sign up response is invalid:', response);
        // Convert to a normal return with null rather than throwing
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Error creating account:', error);
      const errorElement = document.getElementById("su-error-text");
      if (errorElement) {
        errorElement.style.visibility = "visible";
        errorElement.innerHTML = "Error generating your account. " + (error.message || "Unknown error");
      }
      setIsSigningIn(false);
      setIsAuthenticated(false);
      return null;
    }
  }

  async function sendEmail(fullName, username, email) {
    try {
      // Object format for backend expectations
      await authApi.sendNewUserEmail({
        fullName,
        username,
        email
      });
    } catch (error) {
      console.error('Error sending notification email:', error);
      // Continue the process even if the email fails
      // This is non-critical and shouldn't block account creation
    }
  }

  async function handleLogIn(usernameString, passwordString) {
    try {
      // Object format for backend expectations
      const loginResponse = await authApi.login({
        username: usernameString,
        password: passwordString
      });

      if (!loginResponse || !loginResponse.data) {
        console.error('Login response is invalid:', loginResponse);
        return null;
      }

      if (!loginResponse.data.success) {
        console.error(loginResponse.data.error || "Login failed");
        return null;
      }

      // Get user data after successful login
      const userData = await authApi.getCurrentUser();

      if (!userData || !userData.data) {
        console.error('User data response is invalid:', userData);
        return null;
      }

      setIsAuthenticated(true);
      setUser(userData.data);

      return userData.data.uid;
    } catch (error) {
      console.error('Error during login:', error);
      const errorElement = document.getElementById("su-error-text");
      if (errorElement) {
        errorElement.style.visibility = "visible";
        errorElement.innerHTML = "Error during login. " + (error.message || "Unknown error");
      }
      setIsSigningIn(false);
      setIsAuthenticated(false);
      return null;
    }
  }

  async function upsertCustomFields(uid, fullName, email, newsletter) {
    try {
      // Object format for backend expectations
      const response = await authApi.updateNewUser({
        uid,
        fullname: fullName,
        email,
        receivenewsletter: newsletter
      });

      if (!response) {
        console.error('Custom fields update response is invalid:', response);
        return { status: 500 };
      }

      return response;
    } catch (error) {
      console.error('Error updating user fields:', error);
      const errorElement = document.getElementById("su-error-text");
      if (errorElement) {
        errorElement.style.visibility = "visible";
        errorElement.innerHTML = "Error updating user information. " + (error.message || "Unknown error");
      }
      setIsSigningIn(false);
      setIsAuthenticated(false);
      return { status: 500 };
    }
  }

  async function upsertForumFields(uid) {
    try {
      const forumRequestSettings = {
        showemail: "1",
        showfullname: "1"
      };

      return await updateForumSettings(uid, forumRequestSettings);
    } catch (error) {
      console.error('Error updating forum settings:', error);
      // This is non-critical and shouldn't block account creation
      // Just log the error and continue
      return null;
    }
  }

  return (
      <div className="sign-up-page-body">
        <div className="sign-up-body sign-up-section" id="all-sections">
          <div
              className={`first-section sign-up-sec ${
                  currentSection > 1
                      ? "before"
                      : currentSection === 1
                          ? "active"
                          : "after"
              }`}
          >
            {" "}
            <h1>Sign up</h1>

            <div>Already have an account? <a href="/login">Log in</a></div>

            <div className="name-div">
              <label htmlFor="su-name" className="su-name-label">
                Full Name*
              </label>
              <input
                  type="text"
                  name="su-name"
                  className="su-name"
                  id="su-name"
                  value={nameString}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
              />
            </div>
            <div className="name-div">
              <label htmlFor="su-username" className="su-username-label">
                Username*
              </label>
              <input
                  type="text"
                  name="su-username"
                  className="su-username-login-input"
                  value={usernameString}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
              />
            </div>
            <div className="name-div">
              <label htmlFor="su-email" className="su-email-label">
                Email*
              </label>
              <input
                  type="text"
                  name="su-email"
                  className="su-email-login-input"
                  value={emailString}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
              />
            </div>
            <div className="name-div">
              <label htmlFor="su-password" className="su-password-label">
                Password*
              </label>
              <input
                  type="password"
                  name="su-password"
                  className="su-password-login-input"
                  value={passwordString}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    e.preventDefault();
                    e.target.focus({ preventScroll: true });
                    setPassword(e.target.value);
                  }}
              />
            </div>
            <div className="name-div">
              <label
                  htmlFor="su-confirm-password"
                  className="su-confirm-password-label"
              >
                Confirm Password*
              </label>
              <input
                  type="password"
                  name="su-confirm-password"
                  className="su-confirm-password"
                  id="conf-password"
                  value={confirmPasswordString}
                  style={{ width: "100%", marginTop: "0px" }}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
              />
            </div>
            <br /><br />
            <div className="checkbox-section">
              <div className="check-div">
                <input
                    type="checkbox"
                    name="tos-check"
                    className="check-box"
                    onChange={(e) => {
                      setTos(e.target.checked);
                    }}
                />
                <label htmlFor="tos-check">
                  I agree to the{" "}
                  <a href={`${config.DOMAIN}/terms-of-service`} target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </a>
                  * and{" "}
                  <a href={`${config.DOMAIN}/privacy-policy`} target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                  *.
                </label>
              </div>
              <div className="check-div">
                <input
                    type="checkbox"
                    name="adult-check"
                    className="check-box"
                    onChange={(e) => {
                      setTos(e.target.checked);
                    }}
                />
                <label htmlFor="adult-check">
                  I certify that I am at least 18 years of age.*
                </label>
              </div>
              <div className="check-div">
                <input
                    type="checkbox"
                    name="newsletter-check"
                    className="check-box"
                    onChange={(e) => {
                      setMailchimp(e.target.checked);
                    }}
                />
                <label htmlFor="newsletter-check">
                  Sign me up for the Arizona Farm to School Network{" "}
                  <a href={`${config.DOMAIN}/newsletter`} target="_blank" rel="noopener noreferrer">
                    newsletter
                  </a>
                  .
                </label>
              </div>
            </div>
            <div className="su-error-line1">
              <p id="su-error-text"></p>
            </div>
            <br />
            <div className="sign-up-options">
              <PrimaryButton
                  backgroundColor="#668c3c"
                  text="Sign up"
                  onClick={() => {
                    if (!isSigningIn) {
                      // We intentionally don't await this promise here
                      // since we're using UI state (isSigningIn) to manage the flow
                      handleInput().catch(err => {
                        console.error("Unhandled error in signup process:", err);
                        setIsSigningIn(false);
                      });
                    }
                  }}
                  disabled={isSigningIn} // Disable the button while signing in
              ></PrimaryButton>
            </div>
            {isSigningIn && (
                <Box display="flex" justifyContent="center" alignItems="center">
                  <CircularProgress />
                </Box>
            )}
          </div>
        </div>
      </div>
  );
}

export default SignUp;