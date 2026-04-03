import { useEffect, useState } from 'react';
import { DifficultyLevel } from '../types/game';

interface LeaderboardEntry {
  id: number;
  player_name: string;
  score: number;
  moves: number;
  time: number;
  difficulty: DifficultyLevel;
}

interface LeaderboardProps {
  difficulty: DifficultyLevel;
  refresh: number;
}

export const Leaderboard = ({ difficulty, refresh }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [difficulty, refresh]);

  const fetchLeaderboard = () => {
    setLoading(true);

    // ✅ Get from localStorage instead of supabase
    const data = JSON.parse(localStorage.getItem('leaderboard') || '[]');

    const filtered = data
      .filter((item: LeaderboardEntry) => item.difficulty === difficulty)
      .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score)
      .slice(0, 10);

    setEntries(filtered);
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="leaderboard-container">
      <h3 className="text-center mb-3">
        Leaderboard - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </h3>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-center text-muted">No scores yet. Be the first!</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Score</th>
                <th>Moves</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.player_name}</td>
                  <td className="text-success">{entry.score}</td>
                  <td>{entry.moves}</td>
                  <td>{formatTime(entry.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};