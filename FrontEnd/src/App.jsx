import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Message from "./components/Main/Message";
import { Route, Routes } from "react-router-dom";
import Api from "./Api";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/message" element={<Message />} />
        <Route path="/api" element={<Api />} />
      </Routes>
    </>
  );
}

export default App;
