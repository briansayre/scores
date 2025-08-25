import React, { useState } from 'react';
import './App.css';
import { useGameData } from './hooks/useGameData';
import { useGameFilters } from './hooks/useGameFilters';
import { useLocalStorage, useScrollPosition } from './hooks/useLocalStorage';
import { ViewType } from './types';
import { GameList } from './components/game/GameList';
import { MainBar } from './components/common/MainBar';
import { Footer } from './components/common/Footer';
import { SettingsModal } from './components/common/SettingsModal';

function App() {
  const [viewType, setViewType] = useLocalStorage<ViewType>('viewType', 'default');
  const [favoriteTeams, setFavoriteTeams] = useLocalStorage<string[]>('favoriteTeams', []);
  
  const { games, loading, gamesFailed } = useGameData();
  
  const {
    filters,
    filteredGames,
    setLeague,
    setSecondaryFilter,
    setSearch
  } = useGameFilters(games, favoriteTeams);

  const [showSettings, setShowSettings] = useState(false);

  // Enable scroll position persistence after games have loaded
  useScrollPosition(!loading);

  return (
    <div className="App">
      <MainBar
        filters={filters}
        onLeagueChange={setLeague}
        onSecondaryFilterChange={setSecondaryFilter}
        onSearchChange={setSearch}
        onSettingsClick={() => setShowSettings(true)}
      />

      <GameList 
        games={filteredGames}
        loading={loading}
        viewType={viewType}
      />

      <Footer
        gameCount={filteredGames.length}
        totalGames={games.length}
        gamesFailed={gamesFailed}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        games={games}
        favoriteTeams={favoriteTeams}
        onFavoriteTeamsChange={setFavoriteTeams}
        viewType={viewType}
        onViewTypeChange={setViewType}
      />
    </div>
  );
}

export default App;
