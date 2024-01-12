import React, { useState, useEffect } from "react";

const WebSocketExample = () => {
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [websocket, setWebsocket] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/connection/12");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };
    socket.onmessage = (event) => {
      setReceivedMessage(event.data);
      event.data["data"];
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
    socket.onerror = (event) => {
      console.error(
        "Web Socket Error:",
        event.message,
        event.code,
        event.type,
        event
      );
    };
    setWebsocket(socket);
  }, []);
  // Empty dependency array ensures the effect runs only once on mount

  const sendMessage = () => {
    if (websocket && message.trim() !== "") {
      websocket.send(JSON.stringify(message));
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <div>
      <div>
        <strong>Received Message:</strong> {receivedMessage}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </div>
  );
};

export default WebSocketExample;
