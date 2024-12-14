import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Sign up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    axios.post("http://localhost:3001/LoginPopup", { email, password })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };
  

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-input">
          {currState === "Login" ? null : (
            <input type="text" placeholder="Your name" required />
          )}
          <input
            type="email"
            placeholder="Your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-popup-input">
          <input
            type="password"
            placeholder="Your password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button>{currState === "Sign up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>I agree to the terms of use and private policy</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create Account{" "}
            <span onClick={() => setCurrState("Sign up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
