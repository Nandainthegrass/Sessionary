import React from "react";
import { Route, Routes, Navigate, Router } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Message from "./components/Main/Message";
import { BASE_URL } from "./Api";

const NotFound = () => {
  const notFoundStyle = {
    color: "white",
  };

  return <div style={notFoundStyle}>404 - Not Found</div>;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/Sessionary/home" />} />
        <Route path="/Sessionary/home" element={<Home />} />
        <Route path="/Sessionary/signup" element={<Signup />} />
        <Route path="/Sessionary/login" element={<Login />} />
        <Route path="/Sessionary/message" element={<Message />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
