import React, { useState, useEffect } from "react";
import axios from "axios";
import Collapsible from "./messagecomp/Collapsible";
import Container from "./messagecomp/Container";
import Invite from "./messagecomp/Invite";
import "../styles/Message.css";

const WebSocketExample = () => {
  const [receivedMessage, setReceivedMessage] = useState("");
  const [websocket, setWebsocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(null);
  const [divState, setDivState] = useState(false);
  const [requests, setRequests] = useState([]);

  const jtoken = localStorage.getItem("token");
  const UserId = localStorage.getItem("UserID");

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
  const loadRequest = () => {
    if (websocket) {
      websocket.send(JSON.stringify({ type: "pending requests" }));
    }
  };

  let data;
  useEffect(() => {
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
        if (data["type"] == "pending requests") {
          setRequests(data["Username"]);
        }
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
      <nav>
        <div className="empty">
          <p className="title">LOGO</p>
        </div>
        <div>
          <Invite searchUser={searchUser} />
          <button
            onClick={() => {
              loadRequest();
              setDivState(!divState);
            }}
          >
            <i
              style={{
                fontSize: "24px",
                backgroundColor: "white",
                color: "black",
              }}
              className="fa"
            >
              &#xf0f3;
            </i>
          </button>
        </div>
      </nav>

      {divState && (
        <div className="collapse">
          {requests.map((request) => (
            <li key={request}>{request}'s request</li>
          ))}
        </div>
      )}
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
