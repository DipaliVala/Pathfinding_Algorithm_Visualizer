# Pathfinding Algorithm Visualizer

An interactive Pathfinding Algorithm Visualizer built with **React.js** (frontend) and **Python FastAPI** (backend).  
It allows users to create custom mazes, set start/end points, select pathfinding algorithms (A* and BFS), and watch step-by-step visualizations of how these algorithms explore the maze and find the shortest path.

---

## 🌟 Features

- **Interactive Maze Creation**
  - Draw walls/obstacles on a grid by clicking cells
  - Set custom start and end points

- **Algorithm Visualization**
  - Visualize A* (A-star) and Breadth-First Search (BFS)
  - Step-by-step animation of explored nodes and shortest path

- **User-Friendly Interface**
  - Simple controls to switch between modes (draw walls, set start/end)
  - Select algorithm from dropdown
  - Start visualization and reset grid buttons

---

## 🛠 Tech Stack

- Frontend: React.js with CSS for styling
- Backend: Python FastAPI for pathfinding algorithm computations
- Communication: REST API calls (Axios) between frontend and backend

---

## 📁 Project Structure
```
/backend
├── main.py # FastAPI backend server
/frontend
├── src
├── App.js # Main React app
├── components
├── Grid.js # Maze grid and controls
├── Node.js # Single grid cell component
├── App.css # Stylesheet
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm (https://nodejs.org/)
- Python 3.7+
- pip package manager

### Backend Setup

```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
