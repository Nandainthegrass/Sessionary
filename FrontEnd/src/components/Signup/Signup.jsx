import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  async function submitForm(event) {
    event.preventDefault(); //stops default behaviour
    let formData = new FormData(document.getElementById("myForm"));
    let details = JSON.stringify(Object.fromEntries(formData));
    console.log(details);

    try {
      const response = await fetch("http://localhost:8000/register_user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: details,
      });

      if (response.status == 200) {
        setMessage("Signed up successfully! Redirecting to login");
        setTimeout(() => navigate("/login"), 1000);
      } else if (response.status == 409) {
        setMessage("Username Taken. Try a different username!");
      } else {
        setMessage("Submission failed. Try again.");
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("An error occurred during form submission", error);
    }
  }
  return (
    <>
      <div className="sign-container">
        <h1>Sign up!</h1>
        <form id="myForm" onSubmit={() => submitForm(event)}>
          <input
            type="text"
            name="username"
            autoComplete="username"
            className="tf"
            required
          ></input>
          <input
            type="password"
            name="password"
            className="tf"
            autoComplete="current-password"
            required
          ></input>

          <button type="submit">Submit</button>
        </form>
        <p>{message}</p>
      </div>
    </>
  );
}

export default Signup;