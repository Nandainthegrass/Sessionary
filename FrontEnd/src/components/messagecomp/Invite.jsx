import React, { useState } from "react";
import "../../styles/Message.css";

const Invite = ({ searchUser }) => {
  const [message, setMessage] = useState("");

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
