import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Message from "./components/Main/Message";
import Api from "./Api";

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
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/message" element={<Message />} />
        <Route path="/api" element={<Api />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
