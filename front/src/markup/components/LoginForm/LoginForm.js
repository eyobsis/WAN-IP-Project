import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import loginService from "../../../services/login.service";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user_email, setEmail] = useState("");
  const [user_password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Handle client side validations here
    let valid = true; // Flag

    // Email validation
    if (!user_email) {
      setEmailError("Please enter your email address first");
      valid = false;
    } else if (!user_email.includes("@")) {
      setEmailError("Invalid email format");
      valid = false;
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(user_email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }

    // Password has to be at least 6 characters long
    if (!user_password || user_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) {
      return;
    }

    // Handle form submission here
    const formData = {
      user_email,
      user_password,
    };

    // Call the service
    const loginUser = loginService.logIn(formData);

    loginUser
      .then((response) => response.json())
      .then((response) => {
        if (response.status === "success") {
          // Save the user in the local storage
          if (response.data.user_token) {
            localStorage.setItem("user", JSON.stringify(response.data));
          }
          // Redirect the user to the dashboard or home
          if (location.pathname === "/login") {
            window.location.replace("/");
          } else {
            window.location.reload();
          }
        } else {
          // Show an error message
          setServerError(response.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setServerError("An error has occurred. Please try again later." + err);
      });
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Login to your account</h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      {serverError && (
                        <div className="validation-error" role="alert">
                          {serverError}
                        </div>
                      )}
                      <input
                        type="email"
                        name="user_email"
                        value={user_email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email"
                      />
                      {emailError && (
                        <div className="validation-error" role="alert">
                          {emailError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="password"
                        name="user_password"
                        value={user_password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                      />
                      {passwordError && (
                        <div className="validation-error" role="alert">
                          {passwordError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>Login</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;
