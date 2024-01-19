import "../styles/sessions.css";
import { useRef, useState, useEffect} from "react";

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
    <>
    <div ref={containerRef} className="Messaging-div grid-item">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.TimeStamp}>
            <p>{message.Sender}: {message.Data}</p>
            <br></br>
          </div>
        ))}
      </div>
      {localStorage.getItem("SessionID")&& <div><input
        type="text"
        placeholder="Send messages"
        value={data}
        className="search-txt"
        onChange={(e) => setData(e.target.value)}
      />
      <button type="submit" id="send-btn" onClick={() => Send_Message(data)}>
        Send
      </button></div>}
    </div>
    
    </>
  );
};

export default Sessionary_Messages;
