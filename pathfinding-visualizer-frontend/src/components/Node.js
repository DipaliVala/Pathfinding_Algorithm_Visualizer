import React from "react";

function Node({
  isStart,
  isEnd,
  isWall,
  isExplored,
  isPath,
  onClick,
}) {
  let className = "node";
  if (isStart) className += " start";
  else if (isEnd) className += " end";
  else if (isPath) className += " path";
  else if (isExplored) className += " explored";
  else if (isWall) className += " wall";

  return <div className={className} onClick={onClick}></div>;
}

export default Node;
