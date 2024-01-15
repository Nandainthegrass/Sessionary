import React from "react";

const Collapsible = ({ receivedMessage, onhandleRes }) => {
  return (
    <>
      <div id="collapsible">
        <p>{receivedMessage}</p>
        <p>Would you like to accept the request?</p>
        <button onClick={() => onhandleRes(1)}>Yes</button>
        <button onClick={() => onhandleRes(0)}>No</button>
      </div>
    </>
  );
};

export default Collapsible;
