import { useState, useEffect } from "react";

type Player = "X" | "O" | null;
type Difficulty = "easy" | "medium" | "hard";

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [drawScore, setDrawScore] = useState(0);

  const winningLines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const checkWinner = (squares: Player[]) => {
    for (let line of winningLines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line };
      }
    }
    return null;
  };

  const isDraw = (squares: Player[]) =>
    squares.every(Boolean) && !checkWinner(squares);

  /* ---------- SCORE UPDATE ---------- */
  useEffect(() => {
    const result = checkWinner(board);

    if (result?.winner === "X") {
      setPlayerScore(prev => prev + 1);
    } else if (result?.winner === "O") {
      setAiScore(prev => prev + 1);
    } else if (isDraw(board)) {
      setDrawScore(prev => prev + 1);
    }
  }, [board]);

  /* ---------- MINIMAX ---------- */
  const minimax = (newBoard: Player[], isMaximizing: boolean): number => {
    const result = checkWinner(newBoard);
    if (result?.winner === "O") return 1;
    if (result?.winner === "X") return -1;
    if (newBoard.every(Boolean)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      newBoard.forEach((cell, i) => {
        if (!cell) {
          newBoard[i] = "O";
          const score = minimax(newBoard, false);
          newBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      newBoard.forEach((cell, i) => {
        if (!cell) {
          newBoard[i] = "X";
          const score = minimax(newBoard, true);
          newBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      });
      return bestScore;
    }
  };

  const getBestMove = () => {
    let bestScore = -Infinity;
    let move = -1;

    board.forEach((cell, index) => {
      if (!cell) {
        const newBoard = [...board];
        newBoard[index] = "O";
        const score = minimax(newBoard, false);
        if (score > bestScore) {
          bestScore = score;
          move = index;
        }
      }
    });

    return move;
  };

  const getRandomMove = () => {
    const empty = board
      .map((cell, i) => (cell === null ? i : null))
      .filter((v) => v !== null) as number[];

    return empty[Math.floor(Math.random() * empty.length)];
  };

  const aiMove = () => {
    let move = -1;

    if (difficulty === "easy") {
      move = getRandomMove();
    } else if (difficulty === "medium") {
      move = Math.random() < 0.5 ? getRandomMove() : getBestMove();
    } else {
      move = getBestMove();
    }

    if (move !== -1) {
      const newBoard = [...board];
      newBoard[move] = "O";
      setBoard(newBoard);
      setIsPlayerTurn(true);
    }
  };

  useEffect(() => {
    const result = checkWinner(board);
    if (!isPlayerTurn && !result && !isDraw(board)) {
      const timer = setTimeout(() => aiMove(), 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board]);

  const handleClick = (index: number) => {
    if (board[index] || !isPlayerTurn || checkWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const result = checkWinner(board);
  const winner = result?.winner;
  const winningLine = result?.line || [];

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
  };

  const resetScores = () => {
    setPlayerScore(0);
    setAiScore(0);
    setDrawScore(0);
  };

  return (
    <div>
      <h2>🤖 Tic Tac Toe (AI Mode)</h2>

      {/* SCOREBOARD */}
      <div style={{ marginBottom: "15px" }}>
        <strong>Scoreboard:</strong><br />
        👤 Player (X): {playerScore} | 🤖 AI (O): {aiScore} | 🤝 Draws: {drawScore}
      </div>

      {/* Difficulty Selector */}
      <div style={{ marginBottom: "15px" }}>
        <label>Difficulty: </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="grid tic">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${winningLine.includes(index) ? "win" : ""}`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>

      <h3>
        {winner
          ? `Winner: ${winner}`
          : isDraw(board)
          ? "It's a Draw!"
          : isPlayerTurn
          ? "Your Turn (X)"
          : "AI Thinking..."}
      </h3>

      <button onClick={resetGame}>Restart Game</button>
      <button onClick={resetScores} style={{ marginLeft: "10px" }}>
        Reset Scores
      </button>
    </div>
  );
}
