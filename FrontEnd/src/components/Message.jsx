import React, { useState, useEffect } from "react";
import axios from "axios";
import Collapsible from "./messagecomp/Collapsible";
import Container from "./messagecomp/Container";
import Invite from "./messagecomp/Invite";

const WebSocketExample = () => {
  const [receivedMessage, setReceivedMessage] = useState("");
  const [websocket, setWebsocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(null);

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
    const collapsible = document.getElementById("collapsible");
    if (collapsible) {
      collapsible.parentNode.removeChild(collapsible);
    }
  };

  const searchUser = (message) => {
    if (websocket && message.trim() !== "") {
      websocket.send(JSON.stringify({ type: "search", username: message }));
    }
  };

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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Invite searchUser={searchUser} />
      <div>
        {userExists && (
          <Collapsible
            receivedMessage={receivedMessage}
            onhandleRes={handleRes}
          />
        )}
        <div>
          <Container />
        </div>
      </div>
    </div>
  );
};

export default WebSocketExample;
