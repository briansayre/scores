import React from 'react';
import { Game } from '../../types';

interface CompactGameCardProps {
  game: Game;
}

export const CompactGameCard: React.FC<CompactGameCardProps> = ({ game }) => {
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // Remove seconds if present (e.g., "7:30:00 PM" -> "7:30 PM")
    return timeString.replace(/:00\s/, ' ');
  };

  const formatScore = (score: number) => {
    return score > 0 ? score.toString() : '-';
  };

  const getGameStatus = () => {
    if (game.state === 'pre') {
      // For future games, show date first, then time
      return `${game.dateString} • ${formatTime(game.timeString)}`;
    } else if (game.state === 'in') {
      return game.info || 'Live';
    } else {
      return 'Final';
    }
  };

  const isLive = game.state === 'in';
  const isPre = game.state === 'pre';

  return (
    <div className={`compact-game-card ${isLive ? 'live' : ''}`}>
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
          <div className="compact-team-info">
            {/* <span className="compact-team-name">{game.away.name}</span> */}
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
          <div className="compact-team-info">
            {/* <span className="compact-team-name">{game.home.name}</span> */}
            <span className="compact-score">{formatScore(game.home.score)}</span>
          </div>
        </div>
      </div>

      {/* Date - only show for live/final games since pre-games show it in status */}
      {!isPre && (
        <div className="compact-date">
          {game.dateString}
        </div>
      )}

      {/* Live Indicator */}
      {isLive && (
        <div className="compact-live-indicator">
          <span className="live-dot"></span>
          LIVE
        </div>
      )}
    </div>
  );
};

export default CompactGameCard;
