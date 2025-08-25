import React from 'react';
import { LeagueType, SecondaryFilterType } from '../../types';
import { LEAGUE_FILTER_OPTIONS, getSecondaryFilterOptions } from '../../constants/filterOptions';
import { DropdownFilter } from './DropdownFilter';

interface TieredFilterProps {
  league: LeagueType;
  secondaryFilter: SecondaryFilterType;
  onLeagueChange: (league: LeagueType) => void;
  onSecondaryFilterChange: (filter: SecondaryFilterType) => void;
}

export const TieredFilter: React.FC<TieredFilterProps> = ({
  league,
  secondaryFilter,
  onLeagueChange,
  onSecondaryFilterChange
}) => {
  const secondaryOptions = getSecondaryFilterOptions(league);

  const handleLeagueChange = (value: string) => {
    const newLeague = value as LeagueType;
    onLeagueChange(newLeague);
    
    // Reset secondary filter to 'all' when league changes
    // unless the current filter is still available in the new league
    const newSecondaryOptions = getSecondaryFilterOptions(newLeague);
    const isCurrentFilterAvailable = newSecondaryOptions.some(
      option => option.value === secondaryFilter
    );
    
    if (!isCurrentFilterAvailable) {
      onSecondaryFilterChange('all');
    }
  };

  const handleSecondaryFilterChange = (value: string) => {
    onSecondaryFilterChange(value as SecondaryFilterType);
  };

  return (
    <div className="tiered-filter">
      <DropdownFilter
        value={league}
        onChange={handleLeagueChange}
        options={LEAGUE_FILTER_OPTIONS}
        placeholder="League"
        className="league-dropdown"
      />
      <DropdownFilter
        value={secondaryFilter}
        onChange={handleSecondaryFilterChange}
        options={secondaryOptions}
        placeholder="Filter"
        className="secondary-dropdown"
      />
    </div>
  );
};
