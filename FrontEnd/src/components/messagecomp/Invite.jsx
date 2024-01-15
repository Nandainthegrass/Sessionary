import React, { useState } from "react";

const Invite = ({ searchUser }) => {
  const [message, setMessage] = useState("");
  return (
    <>
      <strong>Invite a Friend!</strong>
      <div>
        <input
          placeholder="Username"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={() => {
            searchUser(message);
          }}
        >
          Search
        </button>
        <br />
        <br />
      </div>
    </>
  );
};

export default Invite;
