import "../styles/sessions.css";

const Sessions = ({ Data }) => {
  const sessions = Data[0];
  const Socket = Data[1];
  const update_notif = Data[2];

  const GetMessages = (SessionID) => {
    localStorage.setItem("SessionID", SessionID);
    if (Socket) {
      Socket.send(
        JSON.stringify({ type: "load messages", SessionID: SessionID })
      );
    }
    update_notif();
  };

  return (
    <div className="Search-and-Btn-Container grid-item">
      <input type="text" placeholder="Search" className="search" />
      {sessions.map((session) => (
        <div className="Session-Button" key={session.SessionID}>
          <button onClick={() => GetMessages(session.SessionID)}>
            {session.Username}
            {session.Color == "True" && (<div className="notif">.</div>)}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Sessions;
