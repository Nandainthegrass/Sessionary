import React, { useEffect } from "react";
import "../../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { BASE_URL } from "../../Api";
import { useState } from "react";
import Loader from "../../Loader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}ping`)
      .then((response) => {
        console.log(response);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  localStorage.clear();
  const navigate = useNavigate();

  return (
    <>
      {loading ? (
        <Layout navChildren={<></>} mainContentChildren={<Loader />} />
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
