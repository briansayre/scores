import { useState, useEffect, useCallback } from 'react';
import { Game } from '../types';
import { espnApi } from '../services/espnApi';
import { GameParser } from '../services/gameParser';

const EXTRA_TEAM_IDS = [66, 38, 2460, 2294, 275];
const REFRESH_INTERVAL = 10000;
const AUTO_REFRESH = true; 

interface UseGameDataReturn {
  games: Game[];
  loading: boolean;
  error: string | null;
  refreshGames: () => Promise<void>;
  gamesFailed: number;
}

export const useGameData = (
): UseGameDataReturn => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gamesFailed, setGamesFailed] = useState(0);

  const fetchGames = useCallback(async () => {
    try {
      console.log('Fetching games...');
      setError(null);
      let failedCount = 0;

      const { ncaaGames, nflGames, extraGames } = await espnApi.fetchAllGames(EXTRA_TEAM_IDS);
      const parsedGames: Game[] = [];

      // Parse NCAA games
      ncaaGames.forEach(event => {
        const game = GameParser.parseGame(event, false);
        if (game) {
          parsedGames.push(game);
        } else {
          failedCount++;
        }
      });

      // Parse NFL games
      nflGames.forEach(event => {
        const game = GameParser.parseGame(event, true);
        if (game) {
          parsedGames.push(game);
        } else {
          failedCount++;
        }
      });

      // Parse extra games
      extraGames.forEach(event => {
        const game = GameParser.parseGame(event, false);
        if (game) {
          // Check if game already exists to avoid duplicates
          const exists = parsedGames.some(existingGame => existingGame.id === game.id);
          if (!exists) {
            parsedGames.push(game);
          }
        } else {
          failedCount++;
        }
      });

      // Sort games by date
      parsedGames.sort((a, b) => a.date.getTime() - b.date.getTime());

      setGames(parsedGames);
      setGamesFailed(failedCount);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch games');
      setLoading(false);
    }
  }, []);

  const refreshGames = useCallback(async () => {
    setLoading(true);
    await fetchGames();
  }, [fetchGames]);

  // Simple interval pattern - handles both initial fetch and auto-refresh
  useEffect(() => {
    // Initial fetch
    fetchGames();

    if (!AUTO_REFRESH) return;

    // Set up interval for auto-refresh
    const intervalId = setInterval(() => {
      fetchGames();
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchGames]);

  return {
    games,
    loading,
    error,
    refreshGames,
    gamesFailed
  };
};
