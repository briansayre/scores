import { useState, useMemo } from 'react';
import { Game, GameFilters, LeagueType, SecondaryFilterType } from '../types';
import { getNflDivision } from '../constants/nflDivisions';
import { useLocalStorage } from './useLocalStorage';

interface UseGameFiltersReturn {
  filters: GameFilters;
  filteredGames: Game[];
  setLeague: (league: LeagueType) => void;
  setSecondaryFilter: (filter: SecondaryFilterType) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
}

const defaultFilters: GameFilters = {
  league: 'both',
  secondaryFilter: 'all',
  search: ''
};

export const useGameFilters = (games: Game[], favoriteTeams: string[] = []): UseGameFiltersReturn => {
  const [filters, setFilters] = useLocalStorage<GameFilters>('gameFilters', defaultFilters);

  const filteredGames = useMemo(() => {
    let filtered = [...games];

    // Filter by league (first tier)
    if (filters.league === 'ncaa') {
      filtered = filtered.filter(game => !game.isNfl);
    } else if (filters.league === 'nfl') {
      filtered = filtered.filter(game => game.isNfl);
    }

    // Filter by secondary filter (second tier)
    switch (filters.secondaryFilter) {
      case 'favorites':
        filtered = filtered.filter(game => {
          const homeCompositeId = `${game.isNfl ? 'NFL' : 'NCAA'}:${game.home.id}`;
          const awayCompositeId = `${game.isNfl ? 'NFL' : 'NCAA'}:${game.away.id}`;
          return favoriteTeams.includes(homeCompositeId) || favoriteTeams.includes(awayCompositeId);
        });
        break;
      
      case 'live':
        filtered = filtered.filter(game => game.live === 'live');
        break;
      
      case 'future':
        filtered = filtered.filter(game => game.live === 'upcoming');
        break;
      
      case 'ranked':
        filtered = filtered.filter(game => 
          !game.isNfl && (game.away.rank || game.home.rank)
        );
        break;
      
      // Conference filters for college
      case 'sec':
      case 'big10':
      case 'acc':
      case 'big12':
      case 'pac12':
        filtered = filtered.filter(game => 
          !game.isNfl && (
            game.home.conference === filters.secondaryFilter || 
            game.away.conference === filters.secondaryFilter
          )
        );
        break;
      
      // Division filters for NFL
      case 'afc_east':
      case 'afc_north':
      case 'afc_south':
      case 'afc_west':
      case 'nfc_east':
      case 'nfc_north':
      case 'nfc_south':
      case 'nfc_west':
        filtered = filtered.filter(game => 
          game.isNfl && (
            getNflDivision(game.home.id) === filters.secondaryFilter || 
            getNflDivision(game.away.id) === filters.secondaryFilter
          )
        );
        break;
      
      case 'redzone':
        // Note: This would require playoff status in the game object
        // For now, we'll keep all games as playoff data isn't available
        break;
      
      case 'all':
      default:
        break;
    }

    // Filter by search
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().replace(/\s/g, '');
      filtered = filtered.filter(game => 
        game.away.searchName.includes(searchTerm) || 
        game.home.searchName.includes(searchTerm) ||
        game.away.name.toLowerCase().includes(searchTerm) ||
        game.home.name.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }, [games, filters, favoriteTeams]);

  const setLeague = (league: LeagueType) => {
    setFilters(prev => ({ ...prev, league, tab: league }));
  };

  const setSecondaryFilter = (secondaryFilter: SecondaryFilterType) => {
    setFilters(prev => ({ ...prev, secondaryFilter }));
  };

  const setSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    filteredGames,
    setLeague,
    setSecondaryFilter,
    setSearch,
    resetFilters
  };
};
