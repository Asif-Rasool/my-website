from Game import Game
from Token import Token
import numpy as np


class GameAgent:
    def __init__(self, token: Token):
        """
        Initial call to create your agent.
        This only gets called 1 time and then your agent will play multiple games.
        """
        self._token = token

    def token(self):
        return self._token

    # -------------------------
    # Helpers (Tic-Tac-Toe)
    # -------------------------
    def _legal_moves(self, board):
        moves = []
        for r in range(3):
            for c in range(3):
                # match TicTacToeGame.is_valid_position exactly
                if np.isin(str(''), board[r][c]):
                    moves.append((r, c))
        return moves


    def _is_winner(self, board, mark):
        # rows
        for r in range(3):
            if board[r, 0] == mark and board[r, 1] == mark and board[r, 2] == mark:
                return True
        # cols
        for c in range(3):
            if board[0, c] == mark and board[1, c] == mark and board[2, c] == mark:
                return True
        # diagonals
        if board[0, 0] == mark and board[1, 1] == mark and board[2, 2] == mark:
            return True
        if board[0, 2] == mark and board[1, 1] == mark and board[2, 0] == mark:
            return True
        return False

    def _winning_move(self, board, mark):
        moves = self._legal_moves(board)
        for (r, c) in moves:
            board[r, c] = mark
            win = self._is_winner(board, mark)
            board[r, c] = ""
            if win:
                return (r, c)
        return None

    def _count_next_wins(self, board, mark):
        # number of moves that would win immediately for mark
        cnt = 0
        moves = self._legal_moves(board)
        for (r, c) in moves:
            board[r, c] = mark
            if self._is_winner(board, mark):
                cnt += 1
            board[r, c] = ""
        return cnt

    def _fork_moves(self, board, mark):
        # a fork creates >=2 immediate winning moves next turn
        forks = []
        moves = self._legal_moves(board)
        for (r, c) in moves:
            board[r, c] = mark
            if self._count_next_wins(board, mark) >= 2:
                forks.append((r, c))
            board[r, c] = ""
        return forks

    def _first_available(self, board, candidates):
        for (r, c) in candidates:
            if board[r, c] == "":
                return (r, c)
        return None

    def make_move(self, game: Game):
        """
        Tic-Tac-Toe agent:
        - Never returns an invalid move (only chooses empty '' cells in-bounds)
        - Priorities: win, block, fork, block fork, center, opposite corner, corner, side
        """
        board = game.get_board()

        # Safety: ensure this looks like a 3x3 TicTacToe board
        try:
            shape = board.shape
        except Exception:
            return -1, -1

        if shape[0] != 3 or shape[1] != 3:
            return -1, -1

        legal = self._legal_moves(board)
        if not legal:
            return -1, -1

        x_count = int(np.sum(board == "X"))
        o_count = int(np.sum(board == "O"))
        my = "X" if x_count == o_count else "O"
        opp = "O" if my == "X" else "X"

        # 1) Win now
        m = self._winning_move(board, my)
        if m is not None:
            return m

        # 2) Block opponent win now
        m = self._winning_move(board, opp)
        if m is not None:
            return m

        # 3) Create a fork
        my_forks = self._fork_moves(board, my)
        if len(my_forks) > 0:
            return my_forks[0]

        # 4) Block opponent fork
        opp_forks = self._fork_moves(board, opp)
        if len(opp_forks) > 0:
            if len(opp_forks) == 1:
                return opp_forks[0]

            # Multiple fork threats:
            # Prefer a side move first to break opposite-corner forks.
            sides = [(0, 1), (1, 0), (1, 2), (2, 1)]
            s = self._first_available(board, sides)
            if s is not None:
                return s

            # If no side is available, try a forcing move (create an immediate win threat).
            forcing = []
            for (r, c) in legal:
                board[r, c] = my
                if self._count_next_wins(board, my) >= 1:
                    forcing.append((r, c))
                board[r, c] = ""

            if len(forcing) > 0:
                return forcing[0]

            # Last resort: take one fork square
            return opp_forks[0]

        # 5) Center
        if board[1, 1] == "":
            return (1, 1)

        # 6) Opposite corner
        corners = [(0, 0), (0, 2), (2, 0), (2, 2)]
        opposite = {(0, 0): (2, 2), (2, 2): (0, 0), (0, 2): (2, 0), (2, 0): (0, 2)}
        for (r, c) in corners:
            if board[r, c] == opp:
                oc = opposite[(r, c)]
                if board[oc[0], oc[1]] == "":
                    return oc

        # 7) Any corner
        c = self._first_available(board, corners)
        if c is not None:
            return c

        # 8) Any side
        sides = [(0, 1), (1, 0), (1, 2), (2, 1)]
        s = self._first_available(board, sides)
        if s is not None:
            return s

        # Final fallback (should never happen if legal list is correct)
        return legal[0]
