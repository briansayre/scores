import React, { useState } from 'react';
import { Game, ViewType } from '../../types';
import { isTestingMode, toggleTestingMode } from '../../config/testingMode';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  favoriteTeams: string[];
  onFavoriteTeamsChange: (teams: string[]) => void;
  viewType: ViewType;
  onViewTypeChange: (viewType: ViewType) => void;
}

interface TeamOption {
  id: string;
  name: string;
  searchName: string;
  img: string;
  league: 'NCAA' | 'NFL';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  games,
  favoriteTeams,
  onFavoriteTeamsChange,
  viewType,
  onViewTypeChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [testingModeEnabled, setTestingModeEnabled] = useState(isTestingMode());

  if (!isOpen) return null;

  const handleTestingModeToggle = () => {
    const newMode = toggleTestingMode();
    setTestingModeEnabled(newMode);
    // Refresh the page to apply the new mode
    window.location.reload();
  };

  // Extract unique teams from games
  const getAllTeams = (): TeamOption[] => {
    const teamsMap = new Map<string, TeamOption>();

    games.forEach(game => {
      // Add home team with composite key (league:teamId)
      const homeCompositeId = `${game.isNfl ? 'NFL' : 'NCAA'}:${game.home.id}`;
      if (!teamsMap.has(homeCompositeId)) {
        teamsMap.set(homeCompositeId, {
          id: homeCompositeId,
          name: game.home.name,
          searchName: game.home.searchName,
          img: game.home.img,
          league: game.isNfl ? 'NFL' : 'NCAA'
        });
      }

      // Add away team with composite key (league:teamId)
      const awayCompositeId = `${game.isNfl ? 'NFL' : 'NCAA'}:${game.away.id}`;
      if (!teamsMap.has(awayCompositeId)) {
        teamsMap.set(awayCompositeId, {
          id: awayCompositeId,
          name: game.away.name,
          searchName: game.away.searchName,
          img: game.away.img,
          league: game.isNfl ? 'NFL' : 'NCAA'
        });
      }
    });

    return Array.from(teamsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const allTeams = getAllTeams();

  // Filter teams based on search
  const filteredTeams = allTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.searchName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleTeamToggle = (teamId: string) => {
    const newFavorites = favoriteTeams.includes(teamId)
      ? favoriteTeams.filter(id => id !== teamId)
      : [...favoriteTeams, teamId];

    console.log('Team toggled:', teamId, 'New favorites:', newFavorites);
    onFavoriteTeamsChange(newFavorites);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const clearAllFavorites = () => {
    onFavoriteTeamsChange([]);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content settings-modal">
        <div className="modal-header">
          <h3>Settings</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">

          <div className="settings-section">
            <h4>Display Options</h4>
            <p className="settings-description">
              Choose how you want to view the games list.
            </p>

            <div className="view-toggle-section">
              <div className="view-option">
                <label className="view-option-label">
                  <input
                    type="radio"
                    name="viewType"
                    value="default"
                    checked={viewType === 'default'}
                    onChange={(e) => onViewTypeChange(e.target.value as ViewType)}
                  />
                  <div className="view-option-content">
                    <span className="view-option-title">Default View</span>
                    <span className="view-option-description">
                      Detailed cards with full game information, field position, and stats
                    </span>
                  </div>
                </label>
              </div>

              <div className="view-option">
                <label className="view-option-label">
                  <input
                    type="radio"
                    name="viewType"
                    value="compact"
                    checked={viewType === 'compact'}
                    onChange={(e) => onViewTypeChange(e.target.value as ViewType)}
                  />
                  <div className="view-option-content">
                    <span className="view-option-title">Compact View</span>
                    <span className="view-option-description">
                      Condensed cards showing only essential info - 4 games per row
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h4>Favorite Teams</h4>
            <p className="settings-description">
              Select your favorite teams to quickly filter games.
            </p>

            {/* Search and Filter Controls */}
            <div className="team-search-controls">
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="team-search-input"
              />
            </div>

            {/* Favorite Teams Count */}
            <div className="favorites-summary">
              <span className="favorites-count">
                {favoriteTeams.length} favorite{favoriteTeams.length !== 1 ? 's' : ''} selected
              </span>
              {favoriteTeams.length > 0 && (
                <button className="clear-favorites-btn" onClick={clearAllFavorites}>
                  Clear All
                </button>
              )}
            </div>

            {/* Teams List */}
            <div className="teams-list">
              {filteredTeams.map(team => (
                <div
                  key={team.id}
                  className={`team-item ${favoriteTeams.includes(team.id) ? 'selected' : ''}`}
                  onClick={() => handleTeamToggle(team.id)}
                >
                  <div className="team-info">
                    <img src={team.img} alt={team.name} className="team-logo" />
                    <div className="team-details">
                      <span className="team-name">{team.name}</span>
                      <span className="team-league">{team.league}</span>
                    </div>
                  </div>
                  <div className="team-checkbox">
                    <input
                      type="checkbox"
                      checked={favoriteTeams.includes(team.id)}
                      onChange={() => handleTeamToggle(team.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              ))}

              {filteredTeams.length === 0 && (
                <div className="no-teams-message">
                  No teams found matching your search criteria.
                </div>
              )}
            </div>
          </div>

          <div className="settings-section">
            <h4>Developer Options</h4>
            <div className="testing-mode-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={testingModeEnabled}
                  onChange={handleTestingModeToggle}
                />
                <span className="toggle-text">
                  Testing Mode {testingModeEnabled && '🧪'}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="apply-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
