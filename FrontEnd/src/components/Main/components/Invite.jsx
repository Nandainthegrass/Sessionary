import React, { useState } from "react";
import "../../../styles/Message.css";

const Invite = ({ websocket }) => {
  const [message, setMessage] = useState("");

  const searchUser = (message) => {
    if (websocket && message.trim() !== "") {
      websocket.send(JSON.stringify({ type: "search", username: message }));
    }
  };
  
  return (
    <>
      <div>
        <label htmlFor="invite">Invite a friend: </label>
        <input
          placeholder="Username"
          type="text"
          value={message}
          id="invite"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={() => {
            searchUser(message);
          }}
        >
          Invite
        </button>
      </div>
    </>
  );
};

export default Invite;
