import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import Header from "./Header";
import "../styles/Register.css";

function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  // verification removed: registration now completes and user can log in
  
  
  
  const handleRegister = async () => {
    if (!email.endsWith("@paterostechnologicalcollege.edu.ph")) {
      alert(
        "Please use your institutional email address (e.g., yfmagusib@paterostechnologicalcollege.edu.ph)"
      );
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (!phone.match(/^[0-9]{11}$/)) {
      alert("Please enter a valid 11-digit phone number.");
      return;
    }

    try {
      const res = await axios.post("/register", {
        fullname,
        email,
        phone,
        password,
      });

      alert(res.data.message || "Registration successful! You can now log in.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed. Try again.");
    }
  };


  return (
    <div className="login-page">
      <Header />

      <div className="login-container">
        <div className="tab-navigation">
          <button className="tab-button" onClick={() => navigate("/login")}>
            LOGIN
          </button>
          <button className="tab-button active">REGISTER</button>
        </div>

        <div className="form-section">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-box">
              <i className="fa fa-user icon"></i>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Institutional Email</label>
            <div className="input-box">
              <i className="fa fa-envelope icon"></i>
              <input
                type="email"
                placeholder="Enter your PTC email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <div className="input-box">
              <i className="fa fa-phone icon"></i>
              <input
                type="text"
                placeholder="Enter your 11-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

          <button type="button" className="login-button" onClick={handleRegister}>
            <i className="fa fa-user-plus"></i> REGISTER
          </button>

          <p className="register-text">Already have an account?</p>
          <button className="register-button" onClick={() => navigate("/login") }>
            <i className="fa fa-sign-in"></i> Login Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
