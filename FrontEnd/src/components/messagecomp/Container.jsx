import React, { useState } from "react";

const Container = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && (
        <div className="m-container">
          --Messages--
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      )}
    </>
  );
};

export default Container;
