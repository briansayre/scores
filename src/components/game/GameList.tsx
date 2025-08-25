import React from 'react';
import { Game, ViewType } from '../../types';
import { GameCard } from './GameCard';
import { CompactGameCard } from './CompactGameCard';

interface GameListProps {
  games: Game[];
  loading: boolean;
  viewType: ViewType;
}

export const GameList: React.FC<GameListProps> = ({ games, loading, viewType }) => {
  if (loading && games.length === 0) {
    return (
      <div className="loading-message" style={{ textAlign: 'center' }}>
        <p>Loading games...</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="no-games-message" style={{ textAlign: 'center' }}>
        <p>No games found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className={`game-list ${viewType === 'compact' ? 'compact' : ''}`}>
      {games.map((game) => (
        viewType === 'compact' ? (
          <CompactGameCard key={game.id} game={game} />
        ) : (
          <GameCard key={game.id} game={game} />
        )
      ))}
    </div>
  );
};

export default GameList;
