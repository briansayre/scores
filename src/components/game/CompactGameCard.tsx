import React from 'react';
import './CompactGameCard.css';
import { Game } from '../../types';

interface CompactGameCardProps {
  game: Game;
}

export const CompactGameCard: React.FC<CompactGameCardProps> = ({ game }) => {
  const isPre = game.state === 'pre';
  const isLive = game.state === 'in';

  const formatScore = (score: number): string => {
    return score === 0 && isPre ? '-' : score.toString();
  };

  const getGameStatus = () => {
    if (isPre) {
      return game.odds;
    } else if (isLive) {
      return game.info || 'Live';
    } else {
      return 'Final';
    }
  };

  const getGameInfo = () => {
    if (isLive) {
      return game.situation?.downDistanceText || 'Live';
    } else {
      return `${game.dateString} @ ${game.timeString}`;
    }
  };

  const getPossessionTeam = (): 'home' | 'away' | null => {
    if (game.live !== 'live' || !game.situation?.possession) return null;

    if (game.situation.possession === game.home.id) return 'home';
    if (game.situation.possession === game.away.id) return 'away';
    return null;
  };

  const handleCardClick = () => {
    if (game.link) {
      window.open(game.link, '_blank');
    }
  };

  const possessionTeam = getPossessionTeam();

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
          {possessionTeam === 'away' && (
            <div className="football-icon">
              <div className="football-shape"></div>
            </div>
          )}
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
          {possessionTeam === 'home' && (
            <div className="football-icon">
              <div className="football-shape"></div>
            </div>
          )}
          <div className="compact-team-info">
            <span className="compact-score">{formatScore(game.home.score)}</span>
          </div>
        </div>
      </div>

      <div className="compact-date">
        {getGameInfo()}
      </div>

    </div>
  );
};

export default CompactGameCard;
