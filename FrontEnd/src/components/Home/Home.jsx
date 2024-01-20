import React from "react";
import "../../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { Link } from "react-router-dom";

const Home = () => {
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
            <Link to="/signup">Signup</Link>
          </li>
          <li className="listItem">
            <Link to="/login">Login</Link>
          </li>
        </ul>
      }
      mainContentChildren={<></>}
    />
  );
};

export default Home;
