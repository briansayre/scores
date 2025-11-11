import { useMemo } from 'react';
import { Game, GameFilters, LeagueType, SecondaryFilterType } from '../types';
import { getNflDivision } from '../constants/nflDivisions';
import { useLocalStorage } from './useLocalStorage';

interface LeagueFilters {
  ncaa: SecondaryFilterType;
  nfl: SecondaryFilterType;
  both: SecondaryFilterType;
}

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
  // Track the last used filter for each league
  const [_leagueFilters, setLeagueFilters] = useLocalStorage<LeagueFilters>('leagueFilters', {
    ncaa: 'all',
    nfl: 'all',
    both: 'all'
  });

  const [filters, setFilters] = useLocalStorage<GameFilters>('gameFilters', defaultFilters);

  // Helper function to check if a filter is valid for the current league
  const isValidFilterForLeague = (filter: string, league: LeagueType): boolean => {
    // Universal filters are always valid
    const universalFilters = ['all', 'favorites', 'live', 'future'];
    if (universalFilters.includes(filter)) return true;
    
    // Check NCAA-specific filters
    if (league === 'ncaa') {
      const ncaaFilters = ['ranked', 'acc', 'big10', 'big12', 'sec'];
      return ncaaFilters.includes(filter);
    }
    
    // Check NFL-specific filters
    if (league === 'nfl') {
      const nflFilters = [
        'afc_east', 'afc_north', 'afc_south', 'afc_west',
        'nfc_east', 'nfc_north', 'nfc_south', 'nfc_west'
      ];
      return nflFilters.includes(filter);
    }
    
    // For 'both' league, only universal filters are valid
    return universalFilters.includes(filter);
  };

  const filteredGames = useMemo(() => {
    let filtered = [...games];

    // Ensure filters is defined
    if (!filters) {
      return filtered;
    }

    // Get the current league and filter
    const currentLeague = filters.league;
    const currentFilter = filters.secondaryFilter;

    // If the current filter isn't valid for the current league, don't apply any secondary filtering
    const shouldApplyFilter = isValidFilterForLeague(currentFilter, currentLeague);
    
    // Filter by league (first tier)
    if (currentLeague === 'ncaa') {
      filtered = filtered.filter(game => !game.isNfl);
    } else if (currentLeague === 'nfl') {
      filtered = filtered.filter(game => game.isNfl);
    }

    // Only apply secondary filter if it's valid for the current league
    if (shouldApplyFilter) {
      switch (currentFilter) {
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
              game.home.conference === currentFilter ||
              game.away.conference === currentFilter
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
              getNflDivision(game.home.id) === currentFilter ||
              getNflDivision(game.away.id) === currentFilter
            )
          );
          break;
        case 'all':
        default:
          break;
      }
    }

    // Filter by search
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().replace(/\s/g, '');
      filtered = filtered.filter(game =>
        (game.away.searchName && game.away.searchName.includes(searchTerm)) ||
        (game.home.searchName && game.home.searchName.includes(searchTerm)) ||
        (game.away.name && game.away.name.toLowerCase().includes(searchTerm)) ||
        (game.home.name && game.home.name.toLowerCase().includes(searchTerm))
      );
    }

    return filtered;
  }, [games, filters, favoriteTeams]);

  const setLeague = (newLeague: LeagueType) => {
    // First, save the current filter for the current league
    const currentLeague = filters.league;
    const currentFilter = filters.secondaryFilter;
    
    const updatedLeagueFilters = {
      ..._leagueFilters,
      [currentLeague]: currentFilter
    };
    
    // Update the league filters storage
    setLeagueFilters(updatedLeagueFilters);
    
    // Get the last used filter for the new league
    const lastUsedFilter = updatedLeagueFilters[newLeague] || 'all';
    
    // Update the filters with the new league and its last used filter
    setFilters({
      ...filters,
      league: newLeague,
      secondaryFilter: lastUsedFilter
    });
  };
  const setSecondaryFilter = (secondaryFilter: SecondaryFilterType) => {
    // Save this filter as the last used for the current league
    const updatedLeagueFilters = {
      ..._leagueFilters,
      [filters.league]: secondaryFilter
    };
    
    // Update the league filters storage
    setLeagueFilters(updatedLeagueFilters);
    
    // Update the current filters
    setFilters({
      ...filters,
      secondaryFilter
    });
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
