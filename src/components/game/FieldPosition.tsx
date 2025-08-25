import React from 'react';
import { Game, Team } from '../../types';

interface FieldPositionProps {
  game: Game;
}

export const FieldPosition: React.FC<FieldPositionProps> = ({ game }) => {
  // Only show if game is live and has possession/down data
  if (game.live !== 'live' || !game.situation?.possession || !game.situation?.downDistanceText) {
    return null;
  }

  /**
   * Calculate ball position as percentage across field (0% = away side, 100% = home side)
   * Uses API yardLine data when available, falls back to parsing down/distance text
   */
  const getPositionPercentage = (): number => {
    if (game.situation?.yardLine !== undefined) {
      return game.situation.possession === game.home.id ? game.situation.yardLine : 100 - game.situation.yardLine;
    }
    return 50; // Default to midfield
  };


  const getFirstDownPercentage = (): number => {
    return getPositionPercentage() + (game.situation?.distance ?? 0);
  };

  /**
   * Determine which team has possession and get their primary color
   */
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
        {/* Yard markers */}
        <div className="yard-marker" style={{ left: '20%' }}>20</div>
        <div className="yard-marker midfield" style={{ left: '50%' }}>50</div>
        <div className="yard-marker" style={{ left: '80%' }}>20</div>
        
        {/* Ball position */}
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


        {/* First down position */}
        <div 
          className="first-down"
          style={{ left: `${firstDownPosition}%` }}
        />
      </div>
    </div>
  );
};
