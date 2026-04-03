import { useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { Leaderboard } from './components/Leaderboard';
import { DifficultyLevel } from './types/game';
import { Trophy, Play, RotateCcw } from 'lucide-react';

function App() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [gameKey, setGameKey] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [gameStats, setGameStats] = useState({ score: 0, moves: 0, time: 0 });
  const [playerName, setPlayerName] = useState('');
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);

  const startNewGame = () => {
    setGameKey((prev) => prev + 1);
    setGameStarted(true);
    setShowModal(false);
  };

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    setGameStarted(false);
    setGameKey((prev) => prev + 1);
  };

  const handleGameComplete = (score: number, moves: number, time: number) => {
    setGameStats({ score, moves, time });
    setShowModal(true);
    setGameStarted(false);
  };

  // ✅ LOCAL STORAGE SAVE (NO SUPABASE)
  const saveScore = () => {
    if (!playerName.trim()) return;

    const newEntry = {
      id: Date.now(),
      player_name: playerName,
      score: gameStats.score,
      moves: gameStats.moves,
      time: gameStats.time,
      difficulty: difficulty,
    };

    const existing = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    existing.push(newEntry);
    localStorage.setItem('leaderboard', JSON.stringify(existing));

    setPlayerName('');
    setShowModal(false);
    setLeaderboardRefresh((prev) => prev + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container">
      <div className="container py-5">
        <div className="text-center mb-5">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <Trophy className="text-warning me-2" size={40} />
            <h1 className="display-4 fw-bold mb-0">Memory Game</h1>
          </div>
          <p className="lead text-muted">
            Improve your concentration and memory skills!
          </p>
        </div>

        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center mb-3">Select Difficulty</h5>
                <div className="btn-group w-100">
                  <button
                    className={`btn ${difficulty === 'easy' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => handleDifficultyChange('easy')}
                  >
                    Easy (6 pairs)
                  </button>
                  <button
                    className={`btn ${difficulty === 'medium' ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => handleDifficultyChange('medium')}
                  >
                    Medium (10 pairs)
                  </button>
                  <button
                    className={`btn ${difficulty === 'hard' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => handleDifficultyChange('hard')}
                  >
                    Hard (12 pairs)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body">
                {!gameStarted ? (
                  <div className="text-center py-5">
                    <Play size={64} className="text-primary mb-3" />
                    <h3>Ready to Play?</h3>
                    <p className="text-muted mb-4">
                      Click below to start!
                    </p>
                    <button className="btn btn-primary btn-lg" onClick={startNewGame}>
                      Start Game
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="d-flex justify-content-between mb-3">
                      <h5>Game Board</h5>
                      <button className="btn btn-sm btn-outline-secondary" onClick={startNewGame}>
                        <RotateCcw size={16} /> Reset
                      </button>
                    </div>
                    <GameBoard
                      key={gameKey}
                      difficulty={difficulty}
                      onGameComplete={handleGameComplete}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <Leaderboard difficulty={difficulty} refresh={leaderboardRefresh} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Congratulations!</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body text-center">
                <Trophy size={64} className="text-warning mb-3" />
                <h4>You Won!</h4>

                <div className="row g-3 my-3">
                  <div className="col-4"><b>Score:</b> {gameStats.score}</div>
                  <div className="col-4"><b>Moves:</b> {gameStats.moves}</div>
                  <div className="col-4"><b>Time:</b> {formatTime(gameStats.time)}</div>
                </div>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button className="btn btn-success" onClick={saveScore}>Save Score</button>
                <button className="btn btn-primary" onClick={startNewGame}>Play Again</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;