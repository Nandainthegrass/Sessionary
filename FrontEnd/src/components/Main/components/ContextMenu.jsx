import React from "react";

const ContextMenu = ({ onDelete, position }) => {
  const style = {
    position: "fixed",
    top: position.y,
    left: position.x,
    zIndex: 1000,
    backgroundColor: "white",
  };

  return (
    <div className="context-menu" style={style}>
      <button className="context-menu-item" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export default ContextMenu;
