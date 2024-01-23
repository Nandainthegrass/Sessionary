import React from "react";
import "../../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { Link } from "react-router-dom";

const Home = () => {
  localStorage.clear();
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/signup");
  };
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <Layout
      navChildren={
        <ul className="ulist">
          <li className="listItem">
            <button
              className="route-btn"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Signup
            </button>
          </li>
          <li className="listItem">
            <button className="route-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          </li>
        </ul>
      }
      mainContentChildren={<></>}
    />
  );
};

export default Home;
