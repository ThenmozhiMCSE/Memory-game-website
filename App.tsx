import { useState } from "react";
import { DifficultyLevel } from "./types/game";
import { Leaderboard } from "./components/Leaderboard";

function App() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [refresh, setRefresh] = useState(0);

  const changeDifficulty = (level: DifficultyLevel) => {
    setDifficulty(level);
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Memory Game</h1>

      {/* Difficulty Buttons */}
      <div className="text-center mb-4">
        <button
          className="btn btn-success mx-2"
          onClick={() => changeDifficulty("easy")}
        >
          Easy
        </button>

        <button
          className="btn btn-warning mx-2"
          onClick={() => changeDifficulty("medium")}
        >
          Medium
        </button>

        <button
          className="btn btn-danger mx-2"
          onClick={() => changeDifficulty("hard")}
        >
          Hard
        </button>
      </div>

      {/* Leaderboard */}
      <Leaderboard difficulty={difficulty} refresh={refresh} />
    </div>
  );
}

export default App;