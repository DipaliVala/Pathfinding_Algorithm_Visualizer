import React, { useState, useEffect, useRef } from "react";
import Node from "./Node";
import axios from "axios";

const ROWS = 20;
const COLS = 30;

const MODES = {
  WALL: "wall",
  START: "start",
  END: "end",
};

function Grid({ algorithm }) {
  const emptyGrid = () => Array(ROWS).fill().map(() => Array(COLS).fill(0));

  const [grid, setGrid] = useState(emptyGrid);
  const [start, setStart] = useState([0, 0]);
  const [end, setEnd] = useState([ROWS - 1, COLS - 1]);
  const [path, setPath] = useState([]);
  const [explored, setExplored] = useState([]);
  const [mode, setMode] = useState(MODES.WALL);
  const [isRunning, setIsRunning] = useState(false);

  const timeoutIds = useRef([]);

  const clearTimeouts = () => {
    timeoutIds.current.forEach((id) => clearTimeout(id));
    timeoutIds.current = [];
  };

  // Toggle wall or set start/end based on mode
  const handleCellClick = (row, col) => {
    if (isRunning) return;
    if (mode === MODES.WALL) {
      const newGrid = grid.map((r) => [...r]);
      if (row === start[0] && col === start[1]) return;
      if (row === end[0] && col === end[1]) return;
      newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
      setGrid(newGrid);
    } else if (mode === MODES.START) {
      if (grid[row][col] === 1) return;
      setStart([row, col]);
    } else if (mode === MODES.END) {
      if (grid[row][col] === 1) return;
      setEnd([row, col]);
    }
  };

  // Reset grid & states
  const resetGrid = () => {
    if (isRunning) return;
    clearTimeouts();
    setGrid(emptyGrid());
    setStart([0, 0]);
    setEnd([ROWS - 1, COLS - 1]);
    setPath([]);
    setExplored([]);
  };

  // Visualization with step-by-step animation
  const visualize = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setPath([]);
    setExplored([]);

    try {
      const response = await axios.post("http://localhost:8000/find-path", {
        grid,
        start,
        end,
        algorithm,
      });
      const { explored: exploredNodes, path: finalPath } = response.data;

      // Animate explored nodes
      exploredNodes.forEach((node, i) => {
        const timeoutId = setTimeout(() => {
          setExplored((prev) => [...prev, node]);
        }, 20 * i);
        timeoutIds.current.push(timeoutId);
      });

      // Animate path after exploration
      const pathStart = exploredNodes.length * 20 + 200;
      finalPath.forEach((node, i) => {
        const timeoutId = setTimeout(() => {
          setPath((prev) => [...prev, node]);
          if (i === finalPath.length - 1) setIsRunning(false);
        }, pathStart + 50 * i);
        timeoutIds.current.push(timeoutId);
      });

      if (finalPath.length === 0) {
        setTimeout(() => setIsRunning(false), pathStart);
      }
    } catch (err) {
      console.error(err);
      setIsRunning(false);
    }
  };

  return (
    <div>
      <div className="mode-buttons">
        <button
          className={mode === MODES.WALL ? "active" : ""}
          onClick={() => setMode(MODES.WALL)}
          disabled={isRunning}
        >
          Draw Walls
        </button>
        <button
          className={mode === MODES.START ? "active" : ""}
          onClick={() => setMode(MODES.START)}
          disabled={isRunning}
        >
          Set Start
        </button>
        <button
          className={mode === MODES.END ? "active" : ""}
          onClick={() => setMode(MODES.END)}
          disabled={isRunning}
        >
          Set End
        </button>
      </div>

      <div className="grid">
        {grid.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <Node
                key={j}
                row={i}
                col={j}
                isStart={i === start[0] && j === start[1]}
                isEnd={i === end[0] && j === end[1]}
                isWall={cell === 1}
                isExplored={explored.some((p) => p[0] === i && p[1] === j)}
                isPath={path.some((p) => p[0] === i && p[1] === j)}
                onClick={() => handleCellClick(i, j)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="buttons">
        <button onClick={visualize} disabled={isRunning}>
          Start Visualization
        </button>
        <button onClick={resetGrid} disabled={isRunning}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default Grid;
