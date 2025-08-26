export interface Team {
  id: string;
  name: string;
  searchName: string;
  abbreviation: string;
  score: number;
  record: string;
  rank: string;
  primary: string;
  alternate: string;
  conference?: string;
  img: string;
}

export interface PlayerStat {
  displayValue: string;
  value: number;
  athlete: {
    id: string;
    fullName: string;
    displayName: string;
    shortName: string;
    headshot: string;
    jersey: string;
    position: {
      abbreviation: string;
    };
    team: {
      id: string;
    };
  };
  team: {
    id: string;
  };
}

export interface GameLeaders {
  passingYards?: PlayerStat;
  rushingYards?: PlayerStat;
  receivingYards?: PlayerStat;
}

export interface Game {
  id: string;
  state: string;
  link: string;
  venue: string;
  date: Date;
  dateString: string;
  timeString: string;
  channel: string;
  odds: string;
  topHeader: string;
  isNfl: boolean;
  lastPlay: string;
  info: string;
  situation?: {
    yardLine?: number;
    down?: number;
    distance?: number;
    downDistanceText?: string;
    possession?: string;
    isRedZone?: boolean;
  };
  leaders?: GameLeaders;
  away: Team;
  home: Team;
  live: string;
}

export interface ESPNEvent {
  id: string;
  competitions: ESPNCompetition[];
  status: {
    type: {
      id: string;
      name: string;
      state: string;
      completed: boolean;
      description: string;
      detail: string;
      shortDetail: string;
    };
    period: number;
    clock: number;
    displayClock: string;
  };
  links: Array<{
    href: string;
    text: string;
  }>;
}

export interface ESPNCompetition {
  id: string;
  date: string;
  venue: {
    fullName: string;
  };
  competitors: ESPNCompetitor[];
  broadcasts?: Array<{
    names: string[];
  }>;
  odds?: Array<{
    details: string;
  }>;
  situation?: {
    lastPlay: {
      text: string;
    };
    downDistanceText: string;
    possession: string;
    isRedZone: boolean;
    distance: number;
    yardLine: number;
  };
}

export interface ESPNCompetitor {
  id: string;
  homeAway: string;
  score: string;
  team: {
    id: string;
    displayName: string;
    shortDisplayName: string;
    abbreviation: string;
    color: string;
    alternateColor: string;
    logo: string;
    conferenceId: string;
    logos?: Array<{
      href: string;
      rel: string[];
    }>;
  };
  records?: Array<{
    summary: string;
  }>;
  curatedRank?: {
    current: number;
  };
}

export type ViewType = 'default' | 'compact' | 'detailed';
export type TabType = 'ncaa' | 'nfl' | 'both' | 'favorites';
export type LeagueType = 'ncaa' | 'nfl' | 'both';
export type SecondaryFilterType = 'all' | 'favorites' | 'live' | 'future' | 'ranked' | 
  'sec' | 'big10' | 'acc' | 'big12' | 'pac12' | 
  'afc_east' | 'afc_north' | 'afc_south' | 'afc_west' |
  'nfc_east' | 'nfc_north' | 'nfc_south' | 'nfc_west' | 'redzone';

export interface GameFilters {
  league: LeagueType;
  secondaryFilter: SecondaryFilterType;
  search: string;
}
