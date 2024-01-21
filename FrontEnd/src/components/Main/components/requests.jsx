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
    loadRequest();
    if (Usernames.length != 0){
    setDivState(!divState);
    }
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
      <button className="request-button" onClick={() => Handle_Div()}>
        &#9993;
      </button>
      {divState && (
        <div className="Request-Div">
          {Usernames.map((Username) => (
            <div className="Each-Request" key={Username}>
              <label className="Usernames">{Username}</label>
              <button
                className="Reply-yes"
                onClick={() => replyRequest(Username, 1)}
              >
                &#10004;
              </button>
              <button
                className="Reply-no"
                onClick={() => replyRequest(Username, 0)}
              >
                &#10006;
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Requests;
