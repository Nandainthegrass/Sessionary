import { useState } from "react";

import "./App.css";

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
        if (response.status == 200){
          console.log(response.json())
        } else if (response.status == 269) {
          console.log("Username Taken");
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
