import React, { useState, useEffect } from "react";
import "../styles/sessions.css";
import profile from "./Session_Images/Profile.png";
import ContextMenu from "./ContextMenu";

const Sessions = ({ Data }) => {
  const Socket = Data[1];
  const update_notif = Data[2];

  const [searchTerm, setSearchTerm] = useState("");
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    setSessions(Data[0]);
  }, [Data]);
  const GetMessages = (SessionID) => {
    localStorage.setItem("SessionID", SessionID);
    if (Socket) {
      Socket.send(
        JSON.stringify({ type: "load messages", SessionID: SessionID })
      );
    }
    update_notif();
  };

  const filteredSessions = sessions.filter((session) =>
    session.Username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteSession = (SessionID) => {
    if (Socket) {
      Socket.send(JSON.stringify({ type: "delete", SessionID: SessionID }));
    }

    // Use functional update to ensure you're working with the latest state
    setSessions((prevSessions) =>
      prevSessions.filter((session) => session.SessionID !== SessionID)
    );
  };

  const handleContextMenu = (e, session) => {
    e.preventDefault();
    setShowContextMenu(!showContextMenu);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="Search-and-Btn-Container grid-item">
      <div className="search">
        <input
          type="text"
          placeholder="Search"
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <datalist id="sessionNames">
          {filteredSessions.map((session) => (
            <option key={session.SessionID} value={session.Username} />
          ))}
        </datalist>
      </div>
      <div className="sessions">
        {filteredSessions.map((session) => (
          <button
            key={session.SessionID}
            className="Session-Button"
            onClick={() => GetMessages(session.SessionID)}
            onContextMenu={(e) => handleContextMenu(e, session)}
          >
            <div className="profile-pic">
              <img className="profile" src={profile} alt="Profile" />
            </div>
            <div className="username-and-notif">
              <div className="username">{session.Username}</div>
              <div className="notif">
                {session.Color === "True" && (
                  <div className="notif">&#11044;</div>
                )}
              </div>
            </div>
            {showContextMenu && (
              <ContextMenu
                onDelete={() => {
                  deleteSession(session.SessionID);
                  setShowContextMenu(false);
                }}
                position={menuPosition}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sessions;
