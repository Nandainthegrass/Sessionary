import React from "react";
import "../../styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/signup");
  };
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <>
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
    </>
  );
};

export default Home;
