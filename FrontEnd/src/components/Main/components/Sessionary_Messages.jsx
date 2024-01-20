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
    if (Socket) {
      Socket.send(
        JSON.stringify({
          type: "message",
          data: data,
          SessionID: localStorage.getItem("SessionID"),
        })
      );
    }
    setData("");
    update_sessions(localStorage.getItem("SessionID"));
  };

  return (
    <>
      <div className="Messaging-div grid-item">
        <div ref={containerRef} className="messages">
            {messages.map((message) => (
              <div key={message.TimeStamp}>
                <p>
                  {message.Sender} &gt;&gt;{message.Data}
                </p>
                <br></br>
              </div>
            ))}
          </div>
        <div className="send-msg">
          {localStorage.getItem("SessionID") && (
            <div>
              <input
                type="text"
                placeholder="Send messages"
                value={data}
                className="search-txt"
                onChange={(e) => setData(e.target.value)}
              />
              <button
                type="submit"
                id="send-btn"
                onClick={() => Send_Message(data)}
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
