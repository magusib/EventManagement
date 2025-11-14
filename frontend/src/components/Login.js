import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import Header from "./Header";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!email.endsWith("@paterostechnologicalcollege.edu.ph")) {
    alert("Please use your institutional email to log in.");
    return;
  }

  try {
    const res = await axios.post("/login", { email, password });

    // store token and user silently (no alert)
    if (res.data.token) localStorage.setItem("token", res.data.token);
    if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));

    // redirect to dashboard without alert
    navigate("/dashboard");
  } catch (err) {
    // keep the error alert for failed login
    alert(
      err.response?.data?.error ||
      "Login failed. Please check your credentials."
    );
  }
};

  return (
    <div className="login-page">
      <Header />

      <div className="login-container">
        <div className="tab-navigation">
          <button className="tab-button active">LOGIN</button>
          <button className="tab-button" onClick={() => navigate("/register")}>
            REGISTER
          </button>
        </div>

        <div className="form-section">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-box">
              <i className="fa fa-envelope icon"></i>
              <input
                type="email"
                placeholder="Enter your institutional email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-box">
              <i className="fa fa-lock icon"></i>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="button" className="login-button" onClick={handleLogin}>
            <i className="fa fa-sign-in"></i> LOGIN
          </button>

          <p className="register-text">Don’t have an account yet?</p>
          <button
            className="register-button"
            onClick={() => navigate("/register")}
          >
            <i className="fa fa-user-plus"></i> Register Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
