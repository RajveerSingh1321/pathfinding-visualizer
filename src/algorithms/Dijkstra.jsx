import TinyQueue from 'tinyqueue';
import Pathfinder from './Pathfinder';
import { NODE_WALL, WEIGHT_MAPPING } from '../constants';

export default class Dijkstra extends Pathfinder {
  constructor(...args) {
    super(...args);
    this.pq = new TinyQueue([], (a, b) => a.g - b.g);
  }

  run() {
    const {
      pq,
      dist,
      closed,
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

    pq.push({ x: start.x, y: start.y, g: 0 });
    dist[start.y][start.x] = 0;

    while (pq.length) {
      const current = pq.pop();
      const currentX = current.x;
      const currentY = current.y;

      const alreadyClosed = closed[currentY][currentX];

      if (!alreadyClosed) {
        if (!(currentX === start.x && currentY === start.y)) {
          counter += 1;
        }

        closed[currentY][currentX] = true;

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

          const notClosed = inBounds && !closed[nextY][nextX];

          const isWall =
            notClosed &&
            board[nextY][nextX].type === NODE_WALL &&
            !(nextX === finish.x && nextY === finish.y);

          if (inBounds && notClosed && !isWall) {
            const weight =
              nextX === finish.x && nextY === finish.y
                ? 1
                : WEIGHT_MAPPING[board[nextY][nextX].type];

            const g = dist[currentY][currentX] + weight;

            if (g < dist[nextY][nextX]) {
              dist[nextY][nextX] = g;
              prev[nextY][nextX] = { x: currentX, y: currentY };
              pq.push({ x: nextX, y: nextY, g });
            }
          }
        }
      }
    }

    return counter;
  }
}
