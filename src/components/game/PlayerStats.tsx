import React from 'react';
import { GameLeaders, PlayerStat } from '../../types';
import './PlayerStats.css';

interface PlayerStatsProps {
  leaders?: GameLeaders;
}

interface StatCardProps {
  stat: PlayerStat;
  title: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ stat, title, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{icon} {title}</span>
      </div>
      <div className="player-info">
        <img 
          src={stat.athlete.headshot} 
          alt=""
          className="player-headshot"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo192.png';
          }}
        />
        <div className="player-name">{stat.athlete.shortName}</div>
        <div className="player-stats">{stat.displayValue}</div>
      </div>
    </div>
  );
};

export const PlayerStats: React.FC<PlayerStatsProps> = ({ leaders }) => {
  if (!leaders) return null;

  const hasStats = leaders.passingYards || leaders.rushingYards || leaders.receivingYards;
  if (!hasStats) return null;

  return (
    <div className="player-stats-container">
      <div className="stats-grid">
        {leaders.passingYards && (
          <StatCard 
            stat={leaders.passingYards} 
            title="Passing" 
            icon="🏈" 
          />
        )}
        {leaders.rushingYards && (
          <StatCard 
            stat={leaders.rushingYards} 
            title="Rushing" 
            icon="🏃" 
          />
        )}
        {leaders.receivingYards && (
          <StatCard 
            stat={leaders.receivingYards} 
            title="Receiving" 
            icon="🙌" 
          />
        )}
      </div>
    </div>
  );
};
