import React from 'react';
import './MainBar.css';
import { GameFilters, LeagueType, SecondaryFilterType } from '../../types';
import { TieredFilter } from './TieredFilter';

interface MainBarProps {
  filters: GameFilters;
  onLeagueChange: (league: LeagueType) => void;
  onSecondaryFilterChange: (filter: SecondaryFilterType) => void;
  onSearchChange: (search: string) => void;
  onSettingsClick: () => void;
}

export const MainBar: React.FC<MainBarProps> = ({
  filters,
  onLeagueChange,
  onSecondaryFilterChange,
  onSearchChange,
  onSettingsClick
}) => {
  return (
    <>
      <div className="main-bar">
        <div className="main-bar-content">
          <div className="main-bar-row main-bar-filters">
            <TieredFilter
              league={filters.league}
              secondaryFilter={filters.secondaryFilter}
              onLeagueChange={onLeagueChange}
              onSecondaryFilterChange={onSecondaryFilterChange}
            />
          </div>

          <div className="main-bar-row main-bar-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search teams..."
                value={filters.search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
              />
            </div>

            <button 
              className="action-btn settings-btn"
              onClick={onSettingsClick}
              title="Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainBar;
