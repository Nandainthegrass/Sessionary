import { useState } from "react";

import "./App.css";

function App() {
  function submitForm(event) {
    event.preventDefault(); //stops default behaviour
    let formData = new FormData(document.getElementById("myForm"));
    let details = JSON.stringify(Object.fromEntries(formData));
    console.log(details);

    fetch("http://127.0.0.1:8000/register_user/1232/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: details,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Form submitted successfully");
        } else {
          console.error("Form submission failed");
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
