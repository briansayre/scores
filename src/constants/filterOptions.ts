export interface FilterOption {
  value: string;
  label: string;
}

// League filter options (first tier)
export const LEAGUE_FILTER_OPTIONS: FilterOption[] = [
  { value: 'both', label: 'All Football' },
  { value: 'ncaa', label: 'College' },
  { value: 'nfl', label: 'NFL' }
];

// Secondary filter options (second tier)
export const UNIVERSAL_FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Games' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'live', label: 'Live Games' },
  { value: 'future', label: 'Future Games' },
  { value: 'redzone', label: 'Redzone' }
];

export const COLLEGE_SPECIFIC_FILTERS: FilterOption[] = [
  { value: 'ranked', label: 'Top 25' },
  { value: 'acc', label: 'ACC' },
  { value: 'big10', label: 'Big Ten' },
  { value: 'big12', label: 'Big 12' },
  { value: 'pac12', label: 'Pac-12' },
  { value: 'sec', label: 'SEC' }
];

export const NFL_SPECIFIC_FILTERS: FilterOption[] = [
  { value: 'afc_east', label: 'AFC East' },
  { value: 'afc_north', label: 'AFC North' },
  { value: 'afc_south', label: 'AFC South' },
  { value: 'afc_west', label: 'AFC West' },
  { value: 'nfc_east', label: 'NFC East' },
  { value: 'nfc_north', label: 'NFC North' },
  { value: 'nfc_south', label: 'NFC South' },
  { value: 'nfc_west', label: 'NFC West' }
];

// Function to get secondary filter options based on league selection
export const getSecondaryFilterOptions = (league: string): FilterOption[] => {
  const baseOptions = [...UNIVERSAL_FILTER_OPTIONS];
  
  switch (league) {
    case 'ncaa':
      return [...baseOptions, ...COLLEGE_SPECIFIC_FILTERS];
    case 'nfl':
      return [...baseOptions, ...NFL_SPECIFIC_FILTERS];
    case 'both':
    default:
      return baseOptions;
  }
};
