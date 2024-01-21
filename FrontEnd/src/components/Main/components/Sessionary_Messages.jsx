import "../styles/sessions.css";
import { useRef, useState, useEffect } from "react";

const Sessionary_Messages = ({ Data }) => {
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState([]);
  const containerRef = useRef(null);
  useEffect(() => {
    setMessages(Data[0]);
  }, [Data]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const Socket = Data[1];
  const update_sessions = Data[2];

  const Send_Message = (data) => {
    if (data != "") {
      if (Socket) {
        Socket.send(
          JSON.stringify({
            type: "message",
            data: data,
            SessionID: localStorage.getItem("SessionID"),
          })
        );
      }
      update_sessions(localStorage.getItem("SessionID"));
    }
    setData("");
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      Send_Message(data);
    }
  };

  return (
    <>
      <div className="Messaging-div grid-item">
        <div ref={containerRef} className="messages">
          {messages.map((message, idx) => (
            <div key={idx} className="each-message">
              <div className="message-sender">{message.Sender}&gt;&gt;</div>
              <div className="message-data">{message.Data}</div>
              <div className="message-timestamp">{message.TimeStamp}</div>
              <br></br>
            </div>
          ))}
        </div>
        <div className="send-msg">
          <div className="greater">
          &gt;</div>
          {localStorage.getItem("SessionID") && (
            <div className="text-and-btn">
              <textarea
                placeholder="Send messages"
                value={data}
                className="search-txt"
                id="send-txt"
                onChange={(e) => setData(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button
                type="submit"
                id="send-btn"
                onClick={() => Send_Message(data.trim())}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
      
    </>
  );
};

export default Sessionary_Messages;
