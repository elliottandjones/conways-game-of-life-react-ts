import produce from "immer";
import React from "react";

const numRows = 64;
const numCols = 69;
const cellMod = 0.8;

const buildEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const buildRandomGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(
      Array.from(Array(numCols), () => {
        return Math.random() > cellMod ? 1 : 0;
      })
    );
  }
  return rows;
};

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [1, 1],
  [1, 0],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

const App: React.FC = () => {
  const [grid, setGrid] = React.useState(() => {
    return buildEmptyGrid();
  });
  const [running, setRunning] = React.useState(false);

  const runningRef = React.useRef(running);
  runningRef.current = running;

  const runSimulation = React.useCallback(() => {
    if (!runningRef.current) return;

    setGrid((og) => {
      return produce(og, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const ii = i + x;
              const kk = k + y;
              if (ii >= 0 && ii < numRows && kk >= 0 && kk < numCols) {
                neighbors += og[ii][kk];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (og[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    // simulate
    setTimeout(runSimulation, 400);
  }, []);

  return (
    <main id="world">
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "end" : "begin"}
      </button>
      <button
        onClick={() => {
          setGrid(buildRandomGrid());
        }}
      >
        random
      </button>
      <button
        onClick={() => {
          setGrid(buildEmptyGrid());
        }}
      >
        clear
      </button>
      <div
        style={{
          display: "grid",
          justifyContent: "center",
          gridTemplateColumns: `repeat(${numCols}, 16px)`,
          backgroundColor: "rgb(35,20,10)",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}--${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 16,
                height: 16,
                backgroundColor: grid[i][k] ? "rgb(70, 120, 70)" : undefined,
                border: "solid 1px rgb(10,40,20)",
              }}
            />
          ))
        )}
      </div>
    </main>
  );
};

export default App;
