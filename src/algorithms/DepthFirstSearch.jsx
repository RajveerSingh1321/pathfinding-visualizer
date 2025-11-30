import Denque from 'denque';
import Pathfinder from './Pathfinder';
import { NODE_WALL } from '../constants';

export default class DepthFirstSearch extends Pathfinder {
  constructor(...args) {
    super(...args);
    this.stk = new Denque();
  }

  run() {
    const {
      stk,
      visited,
      prev,
      board,
      start,
      finish,
      updateNodeIsVisited,
      delayedIteration,
    } = this;

    let counter = 0;

    if (start.x === finish.x && start.y === finish.y) {
      return counter;
    }

    stk.push({ x: start.x, y: start.y });

    while (!stk.isEmpty()) {
      const current = stk.pop();
      const currentX = current.x;
      const currentY = current.y;

      const alreadyVisited = visited[currentY][currentX];
      if (!alreadyVisited) {
        if (!(currentX === start.x && currentY === start.y)) {
          counter += 1;
        }

        visited[currentY][currentX] = true;

        if (currentX === finish.x && currentY === finish.y) {
          return this.traceShortestPath(counter);
        }

        if (!(currentX === start.x && currentY === start.y)) {
          updateNodeIsVisited(
            currentY,
            currentX,
            true,
            counter * delayedIteration,
            delayedIteration
          );
        }

        for (let i = 0; i < Pathfinder.dx.length; i += 1) {
          const nextX = currentX + Pathfinder.dx[i];
          const nextY = currentY + Pathfinder.dy[i];

          const inBounds =
            nextX >= 0 &&
            nextX < board[0].length &&
            nextY >= 0 &&
            nextY < board.length;

          const notVisited = inBounds && !visited[nextY][nextX];

          const isWall =
            notVisited &&
            board[nextY][nextX].type === NODE_WALL &&
            !(nextX === finish.x && nextY === finish.y);

          if (inBounds && notVisited && !isWall) {
            prev[nextY][nextX] = { x: currentX, y: currentY };
            stk.push({ x: nextX, y: nextY });
          }
        }
      }
    }

    return counter;
  }
}
