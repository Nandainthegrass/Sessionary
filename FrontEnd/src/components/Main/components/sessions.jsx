import "../styles/sessions.css";

const Sessions = ({ Data }) => {
  const sessions = Data[0];
  const Socket = Data[1];

  return (
    <div className="Main">
      <div className="Search-and-Btn-Container grid-item">
        <input type="text" placeholder="Search" class="search" />
        {sessions.map((session) => (
          <div className="Session-Button" key={session.SessionID}>
            <button>{session.Username}</button>
          </div>
        ))}
      </div>
      <div className="Messaging-div grid-item">
        <div className="messages">hello</div>
        <input type="text" placeholder="Send messages" className="search-txt" />
        <button type="submit" id="send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default Sessions;
