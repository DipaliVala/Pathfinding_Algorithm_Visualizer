import React, { useState } from "react";
import Grid from "./components/Grid";

function App() {
  const [algorithm, setAlgorithm] = useState("bfs");

  return (
    <div className="app">
      <h1>Pathfinding Visualizer</h1>
      <div className="controls">
        <select onChange={(e) => setAlgorithm(e.target.value)} value={algorithm}>
          <option value="bfs">Breadth-First Search (BFS)</option>
          <option value="astar">A* Search</option>
        </select>
      </div>
      <Grid algorithm={algorithm} />
    </div>
  );
}

export default App;
