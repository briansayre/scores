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
  const [leagueFilters, setLeagueFilters] = useLocalStorage<LeagueFilters>('leagueFilters', {
    ncaa: 'all',
    nfl: 'all',
    both: 'all'
  });
  
  const [filters, setFilters] = useLocalStorage<GameFilters>('gameFilters', defaultFilters);

  const filteredGames = useMemo(() => {
    let filtered = [...games];
    
    // Ensure filters is defined
    if (!filters) {
      return filtered;
    }

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
      case 'all':
      default:
        break;
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
    setFilters(prev => {
      // 1. First, get the last used filter for the new league
      const lastUsedFilter = leagueFilters[newLeague] || 'all';
      
      // 2. Determine the new secondary filter
      let newSecondaryFilter: SecondaryFilterType;
      
      if (prev.league === newLeague) {
        // If not actually changing leagues, keep current filter
        newSecondaryFilter = prev.secondaryFilter;
      } else {
        // Otherwise use the last used filter for the new league
        newSecondaryFilter = lastUsedFilter;
      }
      
      // 3. Save the current filter for the current league
      setLeagueFilters(prevFilters => ({
        ...prevFilters,
        [prev.league]: prev.secondaryFilter,
        [newLeague]: newSecondaryFilter
      }));
      
      // 4. Return the new filter state
      return {
        ...prev,
        league: newLeague,
        secondaryFilter: newSecondaryFilter
      };
    });
  };

  const setSecondaryFilter = (secondaryFilter: SecondaryFilterType) => {
    setFilters(prev => {
      // Save this filter as the last used for the current league
      setLeagueFilters(prevFilters => ({
        ...prevFilters,
        [prev.league]: secondaryFilter
      }));
      
      return { ...prev, secondaryFilter };
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
