import json
from workers import WorkerEntrypoint, Response


def _normalize_board(board):
    if not isinstance(board, list) or len(board) != 3:
        return None
    normalized = []
    for row in board:
        if not isinstance(row, list) or len(row) != 3:
            return None
        new_row = []
        for cell in row:
            if cell is None:
                cell = ""
            if not isinstance(cell, str):
                return None
            cell = cell.upper()
            if cell not in {"", "X", "O"}:
                return None
            new_row.append(cell)
        normalized.append(new_row)
    return normalized


def _board_array(board):
    return [row[:] for row in board]


def _legal_moves(board):
    moves = []
    for r in range(3):
        for c in range(3):
            if board[r][c] == "":
                moves.append((r, c))
    return moves


def _is_winner(board, mark):
    for r in range(3):
        if board[r][0] == mark and board[r][1] == mark and board[r][2] == mark:
            return True
    for c in range(3):
        if board[0][c] == mark and board[1][c] == mark and board[2][c] == mark:
            return True
    if board[0][0] == mark and board[1][1] == mark and board[2][2] == mark:
        return True
    if board[0][2] == mark and board[1][1] == mark and board[2][0] == mark:
        return True
    return False


def _winning_move(board, mark):
    for (r, c) in _legal_moves(board):
        board[r][c] = mark
        win = _is_winner(board, mark)
        board[r][c] = ""
        if win:
            return (r, c)
    return None


def _count_next_wins(board, mark):
    cnt = 0
    for (r, c) in _legal_moves(board):
        board[r][c] = mark
        if _is_winner(board, mark):
            cnt += 1
        board[r][c] = ""
    return cnt


def _fork_moves(board, mark):
    forks = []
    for (r, c) in _legal_moves(board):
        board[r][c] = mark
        if _count_next_wins(board, mark) >= 2:
            forks.append((r, c))
        board[r][c] = ""
    return forks


def _first_available(board, candidates):
    for (r, c) in candidates:
        if board[r][c] == "":
            return (r, c)
    return None


def _pick_move(board, my, opp):
    move = _winning_move(board, my)
    if move is not None:
        return move

    move = _winning_move(board, opp)
    if move is not None:
        return move

    my_forks = _fork_moves(board, my)
    if my_forks:
        return my_forks[0]

    opp_forks = _fork_moves(board, opp)
    if opp_forks:
        if len(opp_forks) == 1:
            return opp_forks[0]

        # When the opponent has multiple fork threats (e.g., opposite corners),
        # the optimal defense is to take a side square to prevent both forks.
        sides = [(0, 1), (1, 0), (1, 2), (2, 1)]
        side = _first_available(board, sides)
        if side is not None:
            return side

        forcing = []
        for (r, c) in _legal_moves(board):
            board[r][c] = my
            if _count_next_wins(board, my) >= 1:
                forcing.append((r, c))
            board[r][c] = ""
        if forcing:
            return forcing[0]

        return opp_forks[0]

    if board[1][1] == "":
        return (1, 1)

    corners = [(0, 0), (0, 2), (2, 0), (2, 2)]
    opposite = {(0, 0): (2, 2), (2, 2): (0, 0), (0, 2): (2, 0), (2, 0): (0, 2)}
    for (r, c) in corners:
        if board[r][c] == opp:
            oc = opposite[(r, c)]
            if board[oc[0]][oc[1]] == "":
                return oc

    corner = _first_available(board, corners)
    if corner is not None:
        return corner

    sides = [(0, 1), (1, 0), (1, 2), (2, 1)]
    side = _first_available(board, sides)
    if side is not None:
        return side

    legal = _legal_moves(board)
    return legal[0] if legal else None


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        cors_headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }

        if request.method == "OPTIONS":
            return Response("", status=204, headers=cors_headers)

        if request.method == "GET":
            return Response.json(
                {"status": "ok", "message": "TicTacToe agent ready"},
                headers=cors_headers,
            )

        if request.method != "POST":
            return Response.json(
                {"error": "Method not allowed"},
                status=405,
                headers=cors_headers,
            )

        try:
            payload = await request.json()
        except Exception:
            return Response.json(
                {"error": "Invalid JSON payload"}, status=400, headers=cors_headers
            )

        board = _normalize_board(payload.get("board"))
        if board is None:
            return Response.json(
                {"error": "Board must be a 3x3 array of X/O/''"},
                status=400,
                headers=cors_headers,
            )

        agent_token = str(payload.get("agentToken", "O")).upper()
        if agent_token not in {"X", "O"}:
            agent_token = "O"
        opp_token = "O" if agent_token == "X" else "X"

        board_state = _board_array(board)
        move = _pick_move(board_state, agent_token, opp_token)
        if move is None:
            return Response.json({"row": None, "col": None}, headers=cors_headers)

        return Response.json(
            {"row": int(move[0]), "col": int(move[1])},
            headers=cors_headers,
        )
