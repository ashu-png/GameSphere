import { useState, useEffect } from "react";

type CardType = {
  id: number;
  value: string;
  matched: boolean;
};

const emojis = ["🐶", "🐱", "🐵", "🐸", "🦊", "🐼"];

export default function MemoryGame() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        matched: false,
      }));

    setCards(shuffled);
    setFlipped([]);
    setMoves(0);
  };

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = newFlipped;

      if (cards[first].value === cards[second].value) {
        setCards((prev) =>
          prev.map((card, i) =>
            i === first || i === second
              ? { ...card, matched: true }
              : card
          )
        );
      }

      setTimeout(() => setFlipped([]), 800);
    }
  };

  return (
    <div>
      <h2>Kids Memory Game</h2>
      <p>Moves: {moves}</p>
      <div className="grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${
              flipped.includes(index) || card.matched ? "flipped" : ""
            }`}
            onClick={() => handleClick(index)}
          >
            {flipped.includes(index) || card.matched ? card.value : "❓"}
          </div>
        ))}
      </div>
      <button onClick={startGame}>Restart</button>
    </div>
  );
}
