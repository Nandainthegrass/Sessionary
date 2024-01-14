import React, { useState, useEffect } from "react";
import axios from "axios";

const WebSocketExample = () => {
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [websocket, setWebsocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jtoken = localStorage.getItem("token");
    const UserId = localStorage.getItem("UserID");
    try {
      axios
        .get(`http://localhost:8000/test/${UserId}`, {
          headers: { Authorization: `Bearer ${jtoken}` },
        })
        .then((response) => {
          setLoading(false);
          console.log("GET request successful:", response.data);
        })
        .catch((error) => {
          console.error("GET request failed:", error);
        });

      const [, token] = jtoken.split("Bearer ");
      const socket = new WebSocket(
        `ws://localhost:8000/connection/${UserId}?token=${token}`
      );
      socket.onopen = () => {
        console.log("WebSocket connection opened");
      };
      socket.onmessage = (event) => {
        setReceivedMessage(event.data);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };
      socket.onerror = (event) => {
        console.error("Web Socket Error:", event.message);
      };
      setWebsocket(socket);
    } catch (err) {
      console.error("Not working!");
    }
  }, []);
  // Empty dependency array ensures the effect runs only once on mount

  const sendMessage = () => {
    if (websocket && message.trim() !== "") {
      websocket.send(JSON.stringify({ type: "search", username: message }));
      setMessage(""); // Clear the input after sending
    }
  };

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <div>
        <strong>Invite a friend!</strong> {receivedMessage}
      </div>
      <div>
        <input
          placeholder="Username"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
        <br />
        <br />
      </div>
    </div>
  );
};

export default WebSocketExample;
