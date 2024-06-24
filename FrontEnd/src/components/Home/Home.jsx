import React, { useEffect } from "react";
import "../../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Api";
import { useState } from "react";
import Alert from "../../Layout/Alert";
import Loader from "../../loader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make GET request (ping)
    fetch(`${BASE_URL}ping`)
      .then((response) => {
        // Handle response (for demonstration, you can console log it)
        console.log(response);

        // Once response is received, set loading to false
        setLoading(false);
      })
      .catch((error) => {
        // Handle error if request fails
        console.error("Error fetching data:", error);
        setLoading(false); // Ensure loading is set to false on error too
      });
  }, []);

  localStorage.clear();
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/signup");
  };
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
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
                <button
                  className="route-btn"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </li>
            </ul>
          }
          mainContentChildren={<></>}
        />
      )}
    </>
  );
};

export default Home;
