import React from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
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
        const data = await response.json();
        let UserID = data.UserID;
        let Username = data.Username;
        console.log(`UserId: ${UserID} and UserName: ${Username}`);
        navigate("/login");
      } else if (response.status == 269) {
        console.log("Username Taken");
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("An error occurred during form submission", error);
    }
  }
  return (
    <div>
      <form id="myForm">
        <input type="text" name="username" autoComplete="username"></input>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
        ></input>
        <button type="submit" onClick={() => submitForm(event)}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Signup;
