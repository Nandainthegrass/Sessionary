const Sessions = ({ Data }) => {

  const sessions = Data[0];
  const Socket = Data[1];
  
  return (
    <div className="Main">
      <div className="Session-Button-Container">
        {sessions.map((session) => (
          <div className="Session-Button" key={session.SessionID}>
            <button>{session.Username}</button>
          </div>
        ))}
      </div>
      <div className="Messaging-Div">
            <div className="Message">
                
            </div>
      </div>
    </div>
  );
};

export default Sessions;
