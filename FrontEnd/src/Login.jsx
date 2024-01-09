import React from "react";
import { useState } from "react";

function Login() {
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
        setMessage("Login Successful! Redirect user to a different page");
      } else if (response.status == 220) {
        setMessage("User Doesn't Exist!");
      } else if (response.status == 225) {
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
    <div>
      <h1>Login!</h1>
      <form id="myForm" onSubmit={() => submitForm(event)}>
        <input
          type="text"
          name="username"
          autoComplete="username"
          required
        ></input>
        <br />
        <br />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
        ></input>
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
