import React from 'react';
import './CompactGameCard.css';
import { Game } from '../../types';

interface CompactGameCardProps {
  game: Game;
}

export const CompactGameCard: React.FC<CompactGameCardProps> = ({ game }) => {
  const isPre = game.state === 'pre';
  const isLive = game.state === 'in';
  const isFinal = game.state === 'post';

  const formatScore = (score: number): string => {
    return score === 0 && isPre ? '-' : score.toString();
  };

  const formatTime = (timeString: string): string => {
    return timeString || '';
  };

  const getGameStatus = () => {
    if (game.state === 'pre') {
      // For future games, show date first, then time
      return game.odds;
    } else if (game.state === 'in') {
      return game.info || 'Live';
    } else {
      return 'Final';
    }
  };

  const handleCardClick = () => {
    if (game.link) {
      window.open(game.link, '_blank');
    }
  };

  return (
    <div 
      className={`compact-game-card ${isLive ? 'live' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Game Status/Time */}
      <div className={`compact-status ${isLive ? 'live' : isPre ? 'pre' : 'final'}`}>
        {getGameStatus()}
      </div>

      {/* Teams and Scores */}
      <div className="compact-teams">
        {/* Away Team */}
        <div className="compact-team">
          <img 
            src={game.away.img} 
            alt={game.away.name}
            className="compact-team-logo"
          />
          <span className="compact-team-abbreviation">{game.away.abbreviation}</span>
          <div className="compact-team-info">
            <span className="compact-score">{formatScore(game.away.score)}</span>
          </div>
        </div>

        {/* Home Team */}
        <div className="compact-team">
          <img 
            src={game.home.img} 
            alt={game.home.name}
            className="compact-team-logo"
          />
          <span className="compact-team-abbreviation">{game.home.abbreviation}</span>
          <div className="compact-team-info">
            <span className="compact-score">{formatScore(game.home.score)}</span>
          </div>
        </div>
      </div>

      <div className="compact-date">
        {game.dateString} {game.timeString}
      </div>
      
    </div>
  );
};

export default CompactGameCard;
