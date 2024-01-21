import { useState, useEffect } from "react";
import "../styles/requests.css";

const Requests = ({ Data }) => {
  const [divState, setDivState] = useState(false);
  const [Usernames, setUsernames] = useState([]);

  useEffect(() => {
    setUsernames(Data[0]);
  }, [Data]);

  const Socket = Data[1];

  const loadRequest = () => {
    if (Socket) {
      Socket.send(JSON.stringify({ type: "pending requests" }));
    }
  };

  const Handle_Div = () => {
    setDivState(!divState);
    loadRequest();
  };

  const replyRequest = (Username, response) => {
    const updated_list = Usernames.filter((element) => element !== Username);
    setUsernames(updated_list);
    if (Socket) {
      Socket.send(
        JSON.stringify({
          type: "request",
          username: Username,
          Accepted: response,
        })
      );
    }
    loadRequest();
  };

  return (
    <>
      <div className="request-button">
        <button onClick={() => Handle_Div()}>Requests</button>
      </div>
      {divState && (
        <div className="Request-Div">
          {Usernames.map((Username) => (
            <div className="Each-Request" key={Username}>
              <label className="Usernames">{Username}</label>
              <button
                className="Reply"
                onClick={() => replyRequest(Username, 1)}
              >
                Yes
              </button>
              <button
                className="Reply"
                onClick={() => replyRequest(Username, 0)}
              >
                No
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Requests;
