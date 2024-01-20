import React, { useState, useEffect } from "react";
import axios from "axios";
import Invite from "./components/Invite";
import "../../styles/Message.css";
import Requests from "./components/requests";
import Sessions from "./components/sessions";
import Sessionary_Messages from "./components/Sessionary_Messages";
import "./styles/sessions.css";
import Layout from "../../Layout/Layout";

const WebSocketExample = () => {
  const [websocket, setWebsocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);

  const jtoken = localStorage.getItem("token");
  const UserId = localStorage.getItem("UserID");

  useEffect(() => {
    try {
      const [, token] = jtoken.split("Bearer ");

      axios
        .get(`http://localhost:8000/Load_Details/${UserId}?token=${token}`)
        .then((response) => {
          setLoading(false);
          const session_data = response.data.Sessions;
          setSessions(session_data);
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
        let data = JSON.parse(event.data);

        if (data["type"] == "Error") {
          alert(data["Details"]);
        } else if (data["type"] == "pending requests") {
          setRequests(data["Username"]);
        } else if (data["type"] == "Session") {
          const prevlist = sessions;
          setSessions((prevlist) => [data["Session"], ...prevlist]);
        } else if (data["type"] == "load messages") {
          console.log(data["Messages"])
          setMessages(data["Messages"]);
          console.log(data["Messages"]);
        } else if (data["type"] == "message") {
          console.log(data["Message"]);
          let SessionID = localStorage.getItem("SessionID");
          if (data["SessionID"] == SessionID) {
            const prevmessages = messages;
            setMessages((prevmessages) => prevmessages.concat(data["Message"]));
            console.log(messages);
          } else {
            setSessions(prevList => 
              prevList.map(session => 
                session.SessionID === data["SessionID"]
                  ? { ...session, Color: "True" }
                  : session
              )
            );            
          }
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
  const update_sessions = (Value) => {
    const updatedList = [...sessions];
    const indexToRemove = updatedList.findIndex(
      (sesh) => sesh.SessionID === Value
    );

    if (indexToRemove !== -1) {
      const removedSesh = updatedList.splice(indexToRemove, 1)[0];
      updatedList.unshift(removedSesh);
      setSessions(updatedList);
    }
  };

  const update_notif = () => {
    setSessions(prevList => 
      prevList.map(session => 
        session.SessionID === localStorage.getItem("SessionID")
          ? { ...session, Color: "None" }
          : session
      )
    );            
  }
  if (loading) return <p>Loading...</p>;

  return (
    <Layout
      navChildren={
        <nav>
          <div className="">
            <p className="">LOGO</p>
          </div>
          <div>
            <Invite websocket={websocket} />
          </div>
          <div>{requests && <Requests Data={[requests, websocket]} />}</div>
        </nav>
      }
      mainContentChildren={
        <div className="Main">
          {sessions && <Sessions Data={[sessions, websocket, update_notif]} />}
          {messages && (
          <Sessionary_Messages Data={[messages, websocket, update_sessions]} />
        )}
        </div>
      }
    />
  );
};

export default WebSocketExample;
