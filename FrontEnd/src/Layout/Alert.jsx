import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import "./Alert.css";
import src from "./icons/Close_Window_icon.ico";

const Alert = ({ stats = "Nuh uh", details, onHandleClose }) => {
  return (
    <>
      <div class="outer-div">
        <div className="inner-title">
          <span className="alert-title">{stats}</span>
          <button className="close-btn" onClick={onHandleClose}>
            <img className="close-img" src={src} />
          </button>
        </div>
        <div className="inner-content">
          <span className="alert-txt">{details}</span>
        </div>
      </div>
    </>
  );
};

export default Alert;
