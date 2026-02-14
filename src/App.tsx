import MemoryGame from "./components/MemoryGame";
import TicTacToe from "./components/TicTacToe";
import "./index.css";

export default function App() {
  return (
    <div className="container">
      <MemoryGame />
      <hr />
      <TicTacToe />
    </div>
  );
}
