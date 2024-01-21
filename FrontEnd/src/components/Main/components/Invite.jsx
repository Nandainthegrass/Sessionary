import React, { useState } from "react";
import "../../../styles/Message.css";

const Invite = ({ websocket }) => {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(true);

  const searchUser = (message) => {
    if (message.length != 0) {
      if (websocket && message.trim() !== "") {
        websocket.send(JSON.stringify({ type: "search", username: message }));
        setSent(false);
        setTimeout(() => setSent(true), 3000);
        setMessage("");
      }
    }
  };

  return (
    <>
      <label htmlFor="invite">Invite a friend: </label>
      <input
        placeholder="Username"
        type="text"
        value={message}
        id="invite"
        className="invite-srch-bar"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="invite-btn"
        onClick={() => {
          searchUser(message);
        }}
      >
        {sent ? <>&#x271A;</> : <>&#10004;</>}
      </button>
    </>
  );
};

export default Invite;
