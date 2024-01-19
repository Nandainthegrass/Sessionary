import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Layout/Layout";
import Layout from "../../Layout/Layout";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  async function submitForm(event) {
    event.preventDefault(); //stops default behaviour
    let formData = new FormData(document.getElementById("myForm"));
    let details = JSON.stringify(Object.fromEntries(formData));
    console.log(details);

    try {
      const response = await fetch("http://localhost:8000/Login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: details,
      });

      if (response.status == 200) {
        const data = await response.json();
        let UserID = data.UserID;
        let Username = data.Username;
        console.log(`UserId: ${UserID} and UserName: ${Username}`);

        let authorizationHeader = response.headers.get("Authorization");
        console.log(`Authorization Header: ${authorizationHeader}`);
        localStorage.setItem("UserID", UserID);
        localStorage.setItem("token", authorizationHeader);
        navigate("/message");
        setMessage("Login Successful! Redirect user to a different page");
      } else if (response.status == 400) {
        setMessage("User Doesn't Exist!");
      } else if (response.status == 401) {
        setMessage("Password doesn't match!");
      } else {
        setMessage("Submission failed. Try again.");
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("An error occurred during form submission", error);
    }
  }

  return (
    <Layout
      navChildren={
        <ul className="ulist">
          <li className="listItem">
            <Link to="/">Home</Link>
          </li>
          <li className="listItem">
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
      }
      mainContentChildren={
        <div className="login-content">
          <div className="login-form">
            <h1 style={{ color: "#123ea2", marginBottom: "1.5vh" }}>Login</h1>
            <form id="myForm" onSubmit={() => submitForm(event)}>
              <div>
                <label htmlFor="username">Username: </label>
                <input
                  className="user-details"
                  id="username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  required
                ></input>
              </div>
              <br />

              <div>
                <label htmlFor="password">Password: </label>
                <input
                  id="password"
                  className="user-details"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                ></input>
              </div>
              <br />

              <div>
                <button className="btn" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
          <p>{message}</p>
        </div>
      }
    />
  );
}

export default Login;
