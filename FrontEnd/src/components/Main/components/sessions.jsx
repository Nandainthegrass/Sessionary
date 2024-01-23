import React, { useState } from 'react';
import '../styles/sessions.css';
import profile from './Session_Images/Profile.png';

const Sessions = ({ Data }) => {
  const Socket = Data[1];
  const update_notif = Data[2];

  const [searchTerm, setSearchTerm] = useState('');
  const [sessions, setSessions] = useState(Data[0]);
  const GetMessages = (SessionID) => {
    localStorage.setItem('SessionID', SessionID);
    if (Socket) {
      Socket.send(JSON.stringify({ type: 'load messages', SessionID: SessionID }));
    }
    update_notif();
  };

  const filteredSessions = sessions.filter((session) =>
    session.Username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteSession = (SessionID) => {
      if (Socket) {
        Socket.send(JSON.stringify({ type: 'delete', SessionID: SessionID }));
      }
      const session = localStorage.getItem("SessionID");
      if (session === SessionID) {
        localStorage.removeItem("SessionID");
      }
      // Use functional update to ensure you're working with the latest state
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.SessionID !== SessionID)
      );
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
            //onClick={()=>deleteSession(session.SessionID)}
          >
            <div className="profile-pic">
              <img className="profile" src={profile} alt="Profile" />
            </div>
            <div className="username-and-notif">
              <div className="username">{session.Username}</div>
              <div className="notif">
                {session.Color === 'True' && (
                  <div className="notif">
                    &#11044;
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sessions;
