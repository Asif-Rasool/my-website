# Plan

1. Define the board defining the constraints so that it does not make an invalid move
2. Find out current board status and identify possible locations for putting a token.

## We will implement a smart Generator for the above steps

- The generator first define a valid board so that agent do not put the token outside of the board
- It will make sure the agent do not add a token to a position which is already taken.
- It will first check if the center grid is empty or not. If it empty, it must drop the token there, if it is not, agent will drop the token in one of 4 corners. It will help it not lose a game.
- The ultimate goal is to place three tokens horizontally/diagonally/vertically without breaking any of the rules. Also, at least not lose the game, force it be a draw if it cannot reach to a winning goal state.
