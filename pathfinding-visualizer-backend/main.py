from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Tuple
from queue import Queue
import heapq

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GridRequest(BaseModel):
    grid: List[List[int]]  # 0 = empty, 1 = wall
    start: Tuple[int, int]
    end: Tuple[int, int]
    algorithm: str

def get_neighbors(pos, grid):
    dirs = [(0,1),(1,0),(0,-1),(-1,0)]
    neighbors = []
    for dx, dy in dirs:
        nx, ny = pos[0] + dx, pos[1] + dy
        if 0 <= nx < len(grid) and 0 <= ny < len(grid[0]) and grid[nx][ny] == 0:
            neighbors.append((nx, ny))
    return neighbors

def bfs(grid, start, end):
    q = Queue()
    q.put(start)
    visited = {start: None}
    explored_order = []
    while not q.empty():
        curr = q.get()
        explored_order.append(curr)
        if curr == end:
            break
        for neighbor in get_neighbors(curr, grid):
            if neighbor not in visited:
                visited[neighbor] = curr
                q.put(neighbor)
    path = []
    at = end
    while at and at in visited:
        path.append(at)
        at = visited[at]
    path.reverse()
    return explored_order, path

def heuristic(a, b):
    return abs(a[0]-b[0]) + abs(a[1]-b[1])

def astar(grid, start, end):
    open_set = [(0 + heuristic(start, end), 0, start)]
    came_from = {}
    g_score = {start: 0}
    explored_order = []
    while open_set:
        _, cost, current = heapq.heappop(open_set)
        explored_order.append(current)
        if current == end:
            break
        for neighbor in get_neighbors(current, grid):
            tentative_g = g_score[current] + 1
            if neighbor not in g_score or tentative_g < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score = tentative_g + heuristic(neighbor, end)
                heapq.heappush(open_set, (f_score, tentative_g, neighbor))
    path = []
    at = end
    while at and at in came_from:
        path.append(at)
        at = came_from[at]
    path.reverse()
    return explored_order, path

@app.post("/find-path")
async def find_path(data: GridRequest):
    if data.algorithm == "bfs":
        explored, path = bfs(data.grid, tuple(data.start), tuple(data.end))
    else:
        explored, path = astar(data.grid, tuple(data.start), tuple(data.end))
    return {"explored": explored, "path": path}
