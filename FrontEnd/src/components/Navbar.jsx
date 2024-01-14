import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/signup");
  };
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <>
      <div>
        <nav>
          <div className="empty">
            <p className="title">Sessionary</p>
          </div>
          <ul className="u-list">
            <li href="#">About</li>
            <li href="#">Contact</li>
          </ul>
          <div>
            <button className="login-btn" onClick={handleSignUp}>
              Sign up
            </button>
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
