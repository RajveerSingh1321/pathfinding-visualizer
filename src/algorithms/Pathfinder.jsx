import Denque from 'denque';

export default class Pathfinder {
  constructor(
    board,
    start,
    finish,
    updateNodeIsVisited,
    updateNodeIsShortest,
    delayedIteration
  ) {
    this.start = start;
    this.finish = finish;
    this.updateNodeIsVisited = updateNodeIsVisited;
    this.updateNodeIsShortest = updateNodeIsShortest;
    this.delayedIteration = delayedIteration;
    this._init(board);
    this.timers = new Denque();
  }

  static dx = [0, 0, -1, 1];
  static dy = [-1, 1, 0, 0];

  _init(board) {
    this.board = [];
    this.dist = [];
    this.visited = [];
    this.prev = [];

    for (let i = 0; i < board.length; i += 1) {
      this.board[i] = [];
      this.dist[i] = [];
      this.visited[i] = [];
      this.prev[i] = [];

      for (let j = 0; j < board[i].length; j += 1) {
        this.board[i][j] = { type: board[i][j].type };
        this.dist[i][j] = Infinity;
        this.visited[i][j] = false;
        this.prev[i][j] = { x: -1, y: -1 };
      }
    }

    // closed references visited array used by Dijkstra and A*
    this.closed = this.visited;
  }

  clearTimers = () => {
    while (!this.timers.isEmpty()) {
      const timer = this.timers.shift();
      timer.clear();
    }
    this.timers.clear();
  };

  pauseTimers = () => {
    this.timers.toArray().forEach((timer) => timer.pause());
  };

  resumeTimers = () => {
    this.timers.toArray().forEach((timer) => timer.resume());
  };

  traceShortestPath = (timeCounter) => {
    const { finish, prev, updateNodeIsShortest, delayedIteration } = this;

    const path = [];
    let { x, y } = prev[finish.y][finish.x];

    // Build path backward
    while (prev[y][x].x !== -1 && prev[y][x].y !== -1) {
      path.push({ x, y });

      const px = prev[y][x].x;
      const py = prev[y][x].y;

      x = px;
      y = py;
    }

    // Replay path in forward order
    for (let i = path.length - 1; i >= 0; i -= 1) {
      const pos = path[i];
      const px = pos.x;
      const py = pos.y;

      updateNodeIsShortest(
        py,
        px,
        true,
        timeCounter * delayedIteration,
        delayedIteration
      );

      timeCounter += 1;
    }

    return timeCounter;
  };
}
