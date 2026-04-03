import { useEffect, useState } from 'react';
import { DifficultyLevel } from '../types/game';

interface LeaderboardEntry {
  id: number;
  player_name: string;
  score: number;
  moves: number;
  time: number;
  difficulty: DifficultyLevel;
  created_at: string;
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

  const fetchLeaderboard = async () => {
    setLoading(true);

    // ✅ Dummy data (NO SUPABASE)
    const dummyData: LeaderboardEntry[] = [
      {
        id: 1,
        player_name: "Thenmozhi",
        score: 120,
        moves: 18,
        time: 55,
        difficulty: difficulty,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        player_name: "Player2",
        score: 100,
        moves: 22,
        time: 70,
        difficulty: difficulty,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        player_name: "Player3",
        score: 90,
        moves: 25,
        time: 80,
        difficulty: difficulty,
        created_at: new Date().toISOString()
      }
    ];

    setEntries(dummyData);
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
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
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
                  <td className="fw-bold">{index + 1}</td>
                  <td>{entry.player_name}</td>
                  <td className="text-success fw-bold">{entry.score}</td>
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