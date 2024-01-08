import { useState } from "react";

import "./App.css";
import { Route } from "react-router-dom";

function App() {
  function submitForm(event) {
    event.preventDefault(); //stops default behaviour
    let formData = new FormData(document.getElementById("myForm"));
    let details = JSON.stringify(Object.fromEntries(formData));
    console.log(details);

    fetch("http://localhost:8000/register_user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: details,
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 269) {
          console.log("Username Taken");
        } else {
          console.error("Form submission failed");
        }
      })
      .then((data) => {
        if (data) {
          let UserID = data.UserID;
          let Username = data.Username;
          console.log(`UserId: ${UserID} and UserName: ${Username}`);
        }
      })
      .catch((error) => {
        console.error("An error occurred during form submission", error);
      });
  }
  return (
    <>
      <div>
        <form id="myForm">
          <input type="text" name="username"></input>
          <input type="text" name="password"></input>
          <button type="submit" onClick={() => submitForm(event)}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
