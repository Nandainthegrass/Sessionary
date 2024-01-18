import "../styles/sessions.css";
import { useState, useEffect } from "react";

const Sessionary_Messages = ({ Data }) => {
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setMessages(Data[0]);
  }, [Data]);

  const Socket = Data[1];

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
  };

  return (
    <div className="Messaging-div grid-item">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.TimeStamp}>
            <label>{message.Sender}: {message.Data}</label>
            <br></br>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Send messages"
        value={data}
        className="search-txt"
        onChange={(e) => setData(e.target.value)}
      />
      <button type="submit" id="send-btn" onClick={() => Send_Message(data)}>
        Send
      </button>
    </div>
  );
};

export default Sessionary_Messages;
