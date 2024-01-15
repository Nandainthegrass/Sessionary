import React, { useState, useEffect } from "react";
import axios from "axios";

const WebSocketExample = () => {
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [websocket, setWebsocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(null);

  let data;
  useEffect(() => {
    const jtoken = localStorage.getItem("token");
    const UserId = localStorage.getItem("UserID");
    try {
      const [, token] = jtoken.split("Bearer ");
      axios
        .get(`http://localhost:8000/Load_Details/${UserId}?token=${token}`)
        .then((response) => {
          setLoading(false);
          console.log("GET request successful:", response.data);
        })
        .catch((error) => {
          console.error("GET request failed:", error);
        });

      const socket = new WebSocket(
        `ws://localhost:8000/connection/${UserId}?token=${token}`
      );
      socket.onopen = () => {
        console.log("WebSocket connection opened");
      };
      socket.onmessage = (event) => {
        data = JSON.parse(event.data);
        if (data["type"] == "search") {
          setReceivedMessage(
            `${data["Username"]} wants to send you a message!`
          );
          setUserExists(data["Username"]);
        } else if (data["type"] == "Error") {
          alert(data["Details"]);
        }
        console.log(event.data);
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

  const searchUser = () => {
    if (websocket && message.trim() !== "") {
      websocket.send(JSON.stringify({ type: "search", username: message }));
      setMessage(""); // Clear the input after sending
    }
  };
  const handleRes = (val) => {
    if (websocket) {
      websocket.send(
        JSON.stringify({
          type: "request",
          username: `${userExists}`,
          Accepted: `${val}`,
        })
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <div>
        <strong>Invite a friend!</strong>
      </div>
      <div>
        <input
          placeholder="Username"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={searchUser}>Search</button>
        <br />
        <br />
        <p>{receivedMessage}</p>
        <div>
          {userExists && (
            <>
              <p>Would you like to accept the request?</p>
              <button
                onClick={() => {
                  handleRes(1);
                }}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  handleRes(0);
                }}
              >
                No
              </button>
            </>
          )}
          <div>
            <button
              id="open"
              onClick={() => {
                const scalingDiv = document.getElementById("scaling-div");
                scalingDiv.style.display = "flex";
              }}
            >
              Open
            </button>
            <div id="scaling-div" style={{ display: "none" }}>
              Hey mom
              <button
                id="close"
                onClick={() => {
                  const scalingDiv = document.getElementById("scaling-div");
                  scalingDiv.style.display = "none";
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketExample;
