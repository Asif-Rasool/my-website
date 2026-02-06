import { useEffect, useMemo, useState } from "react";

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
    if (
      board[r][0] === token &&
      board[r][1] === token &&
      board[r][2] === token
    ) {
      return true;
    }
  }

  for (let c = 0; c < 3; c += 1) {
    if (
      board[0][c] === token &&
      board[1][c] === token &&
      board[2][c] === token
    ) {
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

const GAME_LIMIT = 15;
const COOLDOWN_MS = 30 * 60 * 1000;
const STORAGE_GAMES = "ttt_games_played";
const STORAGE_COOLDOWN = "ttt_cooldown_until";

const formatRemaining = (ms) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

export default function Games() {
  const [board, setBoard] = useState(createEmptyBoard);
  const [status, setStatus] = useState(getStatus(createEmptyBoard()));
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState("");
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [gameCounted, setGameCounted] = useState(false);
  const [now, setNow] = useState(Date.now());

  const availableMoves = useMemo(
    () => board.flat().filter((cell) => cell === "").length,
    [board],
  );

  const isLocked = now < cooldownUntil;
  const remainingMs = cooldownUntil - now;

  useEffect(() => {
    const storedGames = Number(localStorage.getItem(STORAGE_GAMES) || "0");
    const storedCooldown = Number(localStorage.getItem(STORAGE_COOLDOWN) || "0");
    setGamesPlayed(Number.isFinite(storedGames) ? storedGames : 0);
    setCooldownUntil(Number.isFinite(storedCooldown) ? storedCooldown : 0);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_GAMES, String(gamesPlayed));
  }, [gamesPlayed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_COOLDOWN, String(cooldownUntil));
  }, [cooldownUntil]);

  useEffect(() => {
    if (!isLocked) return undefined;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isLocked]);

  const resetGame = () => {
    if (isLocked) {
      return;
    }
    const fresh = createEmptyBoard();
    setBoard(fresh);
    setStatus(getStatus(fresh));
    setIsThinking(false);
    setError("");
    setGameCounted(false);
  };

  const handleGameEnd = () => {
    if (gameCounted) return;
    const nextCount = gamesPlayed + 1;
    setGamesPlayed(nextCount);
    setGameCounted(true);

    if (nextCount >= GAME_LIMIT) {
      const until = Date.now() + COOLDOWN_MS;
      setCooldownUntil(until);
      setGamesPlayed(0);
    }
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
    if (isLocked || status.done || isThinking || board[row][col] !== "") {
      return;
    }

    const nextBoard = cloneBoard(board);
    nextBoard[row][col] = "X";
    const nextStatus = getStatus(nextBoard);
    setBoard(nextBoard);
    setStatus(nextStatus);
    setError("");

    if (nextStatus.done) {
      handleGameEnd();
      return;
    }

    setIsThinking(true);
    setStatus({ done: false, message: "Agent thinking..." });

    try {
      const move = await requestAgentMove(nextBoard);
      const result = applyAgentMove(nextBoard, move.row, move.col);
      setBoard(result.board);
      setStatus(result.status);
      if (result.status.done) {
        handleGameEnd();
      }
    } catch (err) {
      setStatus({ done: true, message: "Agent is offline right now." });
      setError(err?.message || "Unknown error");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="games-view">
      <section className="page-section games-section">
        <div className="games-grid">
          <div className="games-copy">
            <div className="section-heading">
              <div>
                <h2>Tic-Tac-Toe vs Agent</h2>
              </div>
            </div>
            <p>
              While I was taking Knowledge-Based AI (KBAI) at Georgia Tech, I
              built an agent that plays one of our first childhood intelligence
              games: Tic-Tac-Toe. The goal of this project was to create a
              knowledge-based AI agent that can reason about the game, think
              through possible moves, and make decisions the way a human player
              would. If you can beat my agent, I will buy you coffee.
            </p>
            <a
              className="ttt-github"
              href="https://github.com/Asif-Rasool/my-website/tree/main/tic-tac-toe/Kbai_Gaming_v2.0.1"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                className="ttt-github__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.38-3.37-1.38-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05.8-.23 1.66-.34 2.52-.35.86.01 1.72.12 2.52.35 1.9-1.33 2.74-1.05 2.74-1.05.56 1.4.21 2.44.11 2.7.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.07 10.07 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"
                />
              </svg>
              View the agent code on GitHub
            </a>
          </div>
          <div className="ttt-stack">
            <p className="muted ttt-intro">You play as X. The agent replies as O.</p>
            {isLocked ? (
              <p className="ttt-lockout">
                You’ve reached 10 games. Take a short break and come back in{" "}
                <strong>{formatRemaining(remainingMs)}</strong>.
              </p>
            ) : null}
            <div
              className="ttt-board"
              role="grid"
              aria-label="Tic Tac Toe board"
            >
              {board.map((rowData, rowIndex) =>
                rowData.map((cell, colIndex) => {
                  const key = `${rowIndex}-${colIndex}`;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`ttt-cell ${
                        cell === "X"
                          ? "ttt-cell--x"
                          : cell === "O"
                            ? "ttt-cell--o"
                            : ""
                      }`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      disabled={isLocked || status.done || isThinking || cell !== ""}
                      aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}`}
                    >
                      {cell || <span className="ttt-cell__placeholder" />}
                    </button>
                  );
                }),
              )}
            </div>

            <div className="ttt-status">
              <div className="ttt-status__header">
                <h3>Scoreboard</h3>
                <span className="ttt-status__badge">Live</span>
              </div>
              <p className="ttt-status__message">{status.message}</p>
              <div className="ttt-status__row">
                <span>Empty cells</span>
                <strong>{availableMoves}</strong>
              </div>
              {error ? <p className="ttt-error">{error}</p> : null}
            </div>

            <button
              className="games-reset"
              onClick={resetGame}
              type="button"
              disabled={isLocked}
            >
              New game
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
