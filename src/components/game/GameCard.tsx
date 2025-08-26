import React, { useState } from 'react';
import './GameCard.css';
import { Game } from '../../types';
import { FieldPosition } from './FieldPosition';
import { PlayerStats } from './PlayerStats';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const getGameStatusClass = (): string => {
    switch (game.live) {
      case 'live': return 'live';
      case 'final': return 'final';
      default: return 'upcoming';
    }
  };

  const isCriticalTime = (): boolean => {
    if (game.live !== 'live' || !game.info) return false;
    
    const timeMatch = game.info.match(/(\d+)(?:st|nd|rd|th)\s+(\d+):(\d+)/);
    if (!timeMatch) return false;
    
    const quarter = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const seconds = parseInt(timeMatch[3]);
    
    if (quarter < 4) return false;
    
    const totalSeconds = minutes * 60 + seconds;
    return totalSeconds <= 120;
  };

  const getPossessionTeam = (): 'home' | 'away' | null => {
    if (game.live !== 'live' || !game.situation?.possession) return null;
    
    if (game.situation.possession === game.home.id) return 'home';
    if (game.situation.possession === game.away.id) return 'away';
    return null;
  };

  const formatScore = (score: number): string => {
    return game.live === 'upcoming' ? '-' : score.toString();
  };

  const getInfoText = (): string => {
    if (game.live === 'live') {
      const downAndDist = game.situation?.downDistanceText ? `${game.situation.downDistanceText} - ` : '';
      return `${downAndDist}${game.lastPlay}`;
    }
    return game.venue;
  };

  const shouldScroll = (): boolean => {
    return getInfoText().length > 50;
  };

  const possessionTeam = getPossessionTeam();

  const handleCardClick = () => {
    if (game.leaders && (game.leaders.passingYards || game.leaders.rushingYards || game.leaders.receivingYards)) {
      setIsExpanded(!isExpanded);
    }
  };

  const hasStats = game.leaders && (game.leaders.passingYards || game.leaders.rushingYards || game.leaders.receivingYards);

  return (
    <div 
      className={`game-card ${getGameStatusClass()} ${isCriticalTime() ? 'critical-time' : ''} ${isExpanded ? 'expanded' : ''} ${hasStats ? 'clickable' : ''}`}
      onClick={handleCardClick}
    >
      <div className="game-header">
        <div className="game-time-info">
          <span className="game-date">{game.dateString}</span>
          <span className="game-time">{game.timeString}</span>
        </div>
        
        <div className="game-meta">
          {game.info && game.info !== game.timeString ? (
            <span className={`game-status-top ${game.live === 'live' && isCriticalTime() ? 'critical' : game.live === 'live' ? 'live' : ''}`}>{game.info}</span>
          ) : (
            game.odds && <span className="game-odds">{game.odds}</span>
          )}
        </div>
      </div>

      <div className="teams-container">
        <div className="teams-stack">
          <div className="team away">
            <img src={game.away.img} alt={game.away.name} className="team-logo" />
            <div className="team-details">
              <div className="team-name-row">
                {game.away.rank && <span className="rank">#{game.away.rank}</span>}
                <span className="team-name">{game.away.name}</span>
                {possessionTeam === 'away' && (
                  <div className="football-icon">
                    <div className="football-shape"></div>
                  </div>
                )}
              </div>
              {game.away.record && <span className="record">{game.away.record}</span>}
            </div>
          </div>

          <div className="team home">
            <img src={game.home.img} alt={game.home.name} className="team-logo" />
            <div className="team-details">
              <div className="team-name-row">
                {game.home.rank && <span className="rank">#{game.home.rank}</span>}
                <span className="team-name">{game.home.name}</span>
                {possessionTeam === 'home' && (
                  <div className="football-icon">
                    <div className="football-shape"></div>
                  </div>
                )}
              </div>
              {game.home.record && <span className="record">{game.home.record}</span>}
            </div>
          </div>
        </div>

        <div className="scores-stack">
          <div className="team-score">{formatScore(game.away.score)}</div>
          <div className="team-score">{formatScore(game.home.score)}</div>
        </div>
      </div>

      <FieldPosition game={game} />

      <div className={`game-stats ${isExpanded ? 'expanded' : ''}`}>
        {isExpanded && <PlayerStats leaders={game.leaders} />}
      </div>

      <div className="game-footer">
        <div className="venue-channel-row">
          <span className={`venue ${shouldScroll() ? 'scrolling' : ''}`}>
            {shouldScroll() ? (
              <span className="scrolling-text">{getInfoText()}</span>
            ) : (
              getInfoText()
            )}
          </span>
          <div className="channel-link-row">
            {game.channel && <span className="channel">{game.channel}</span>}
            {game.link && (
              <a 
                href={game.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="espn-link"
                onClick={(e) => e.stopPropagation()}
                title="View on ESPN"
              >
                ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
