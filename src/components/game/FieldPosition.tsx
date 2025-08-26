import React from 'react';
import './FieldPosition.css';
import { Game, Team } from '../../types';

interface FieldPositionProps {
  game: Game;
}

export const FieldPosition: React.FC<FieldPositionProps> = ({ game }) => {
  if (game.live !== 'live' || !game.situation?.possession || !game.situation?.downDistanceText) {
    return null;
  }

  const getPositionPercentage = (): number => {
    if (game.situation?.yardLine !== undefined) {
      return game.situation.possession === game.home.id ? game.situation.yardLine : 100 - game.situation.yardLine;
    }
    return 50;
  };


  const getFirstDownPercentage = (): number => {
    return getPositionPercentage() + (game.situation?.distance ?? 0);
  };

  const getPossessionInfo = (): { team: Team; color: string } => {
    const isHomePossession = game.situation?.possession === game.home.id;
    const team = isHomePossession ? game.home : game.away;
    const color = `#${team.primary}`;
    
    return { team, color };
  };

  const position = getPositionPercentage();
  const firstDownPosition = getFirstDownPercentage();
  const { team: possessionTeam, color: ballColor } = getPossessionInfo();

  return (
    <div className="field-position-minimal">
      <div className="field-line">
        <div className="yard-marker" style={{ left: '20%' }}>20</div>
        <div className="yard-marker midfield" style={{ left: '50%' }}>50</div>
        <div className="yard-marker" style={{ left: '80%' }}>20</div>
        <div 
          className={`ball-position ${possessionTeam}`}
          style={{ left: `${position}%` }}
        >
          <div 
            className="ball" 
            style={{ 
              backgroundColor: ballColor,
              boxShadow: `0 0 3px ${ballColor}80`
            }}
          ></div>
        </div>
        <div 
          className="first-down"
          style={{ left: `${firstDownPosition}%` }}
        />
      </div>
    </div>
  );
};
