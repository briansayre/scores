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
      <div className="game-count" style={{ textAlign: 'center' }}>
        <p>Loading games...</p>
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
