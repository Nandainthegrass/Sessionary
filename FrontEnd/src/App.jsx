import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import Message from "./Message";
import "./App.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/message" element={<Message />} />
      </Routes>
    </>
  );
}

export default App;
