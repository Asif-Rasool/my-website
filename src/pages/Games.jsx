import { useMemo, useState } from "react";

const API_ENDPOINT =
  import.meta.env.VITE_TTT_API_BASE || "/api/tic-tac-toe/move";

const createEmptyBoard = () => [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const cloneBoard = (board) => board.map((row) => [...row]);

const isBoardFull = (board) =>
  board.every((row) => row.every((cell) => cell !== ""));

const checkWinner = (board, token) => {
  for (let r = 0; r < 3; r += 1) {
    if (board[r][0] === token && board[r][1] === token && board[r][2] === token) {
      return true;
    }
  }

  for (let c = 0; c < 3; c += 1) {
    if (board[0][c] === token && board[1][c] === token && board[2][c] === token) {
      return true;
    }
  }

  if (board[0][0] === token && board[1][1] === token && board[2][2] === token) {
    return true;
  }

  if (board[0][2] === token && board[1][1] === token && board[2][0] === token) {
    return true;
  }

  return false;
};

const getStatus = (board) => {
  if (checkWinner(board, "X")) {
    return { done: true, message: "You win. Great read on the board." };
  }
  if (checkWinner(board, "O")) {
    return { done: true, message: "Agent wins. Want a rematch?" };
  }
  if (isBoardFull(board)) {
    return { done: true, message: "Draw. That was a tight match." };
  }
  return { done: false, message: "Your move. You are playing X." };
};

export default function Games() {
  const [board, setBoard] = useState(createEmptyBoard);
  const [status, setStatus] = useState(getStatus(createEmptyBoard()));
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState("");

  const availableMoves = useMemo(
    () => board.flat().filter((cell) => cell === "").length,
    [board]
  );

  const resetGame = () => {
    const fresh = createEmptyBoard();
    setBoard(fresh);
    setStatus(getStatus(fresh));
    setIsThinking(false);
    setError("");
  };

  const applyAgentMove = (nextBoard, row, col) => {
    if (row == null || col == null) {
      return { board: nextBoard, status: getStatus(nextBoard) };
    }

    if (nextBoard[row][col] !== "") {
      return {
        board: nextBoard,
        status: {
          done: true,
          message: "Agent returned an invalid move. Please try again.",
        },
      };
    }

    const updated = cloneBoard(nextBoard);
    updated[row][col] = "O";
    return { board: updated, status: getStatus(updated) };
  };

  const requestAgentMove = async (nextBoard) => {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board: nextBoard,
        agentToken: "O",
      }),
    });

    if (!response.ok) {
      throw new Error(`Agent request failed (${response.status})`);
    }

    const payload = await response.json();
    if (payload?.error) {
      throw new Error(payload.error);
    }

    if (payload?.row != null && payload?.col != null) {
      return { row: payload.row, col: payload.col };
    }

    if (Array.isArray(payload?.move) && payload.move.length === 2) {
      return { row: payload.move[0], col: payload.move[1] };
    }

    return { row: null, col: null };
  };

  const handleCellClick = async (row, col) => {
    if (status.done || isThinking || board[row][col] !== "") {
      return;
    }

    const nextBoard = cloneBoard(board);
    nextBoard[row][col] = "X";
    const nextStatus = getStatus(nextBoard);
    setBoard(nextBoard);
    setStatus(nextStatus);
    setError("");

    if (nextStatus.done) {
      return;
    }

    setIsThinking(true);
    setStatus({ done: false, message: "Agent thinking..." });

    try {
      const move = await requestAgentMove(nextBoard);
      const result = applyAgentMove(nextBoard, move.row, move.col);
      setBoard(result.board);
      setStatus(result.status);
    } catch (err) {
      setStatus({ done: true, message: "Agent is offline right now." });
      setError(err?.message || "Unknown error");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="games-view">
      <section className="hero-panel games-hero">
        <div className="games-hero__content">
          <span className="badge badge--gold">Games</span>
          <h1>Play against my AI agents</h1>
          <p>
            Welcome to the Games lab. Tic-Tac-Toe is live now, and Connect-4 is
            next in line. Beat the agent, or force a draw if you can.
          </p>
        </div>
      </section>

      <section className="page-section games-section">
        <div className="section-heading">
          <div>
            <h2>Tic-Tac-Toe vs Agent</h2>
            <p className="muted">
              You play as X. The agent replies as O using the Python worker.
            </p>
          </div>
          <button className="games-reset" onClick={resetGame} type="button">
            New game
          </button>
        </div>

        <div className="games-grid">
          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
            {board.map((rowData, rowIndex) =>
              rowData.map((cell, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`ttt-cell ${
                      cell === "X" ? "ttt-cell--x" : cell === "O" ? "ttt-cell--o" : ""
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    disabled={status.done || isThinking || cell !== ""}
                    aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}`}
                  >
                    {cell || <span className="ttt-cell__placeholder" />}
                  </button>
                );
              })
            )}
          </div>

          <aside className="ttt-panel">
            <div className="ttt-status">
              <h3>Status</h3>
              <p>{status.message}</p>
              <p className="ttt-meta">
                Empty cells left: <strong>{availableMoves}</strong>
              </p>
              {error ? <p className="ttt-error">{error}</p> : null}
            </div>

            <div className="ttt-rules">
              <h3>How it works</h3>
              <p>
                The board state is sent to a Python Worker running your agent.
                The response returns the agent’s next move.
              </p>
              <p>
                If the worker is unavailable, the game will pause and you can
                restart later.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
