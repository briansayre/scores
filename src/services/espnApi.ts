import { ESPNEvent } from '../types';
import { isTestingMode } from '../config/testingMode';
import { mockNCAAGames, mockNFLGames, mockExtraGames } from './mockData';

const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/football';

export class ESPNApiService {
  private static instance: ESPNApiService;

  public static getInstance(): ESPNApiService {
    if (!ESPNApiService.instance) {
      ESPNApiService.instance = new ESPNApiService();
    }
    return ESPNApiService.instance;
  }

  async fetchNCAAgames(): Promise<ESPNEvent[]> {
    if (isTestingMode()) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      return [...mockNCAAGames];
    }

    try {
      const response = await fetch(
        `${ESPN_BASE_URL}/college-football/scoreboard?groups=80`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching NCAA games:', error);
      return [];
    }
  }

  async fetchNFLGames(): Promise<ESPNEvent[]> {
    if (isTestingMode()) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [...mockNFLGames];
    }

    try {
      const response = await fetch(`${ESPN_BASE_URL}/nfl/scoreboard`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching NFL games:', error);
      return [];
    }
  }

  async fetchExtraNCAAGame(gameId: string): Promise<ESPNEvent | null> {
    if (isTestingMode()) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 150));
      return mockExtraGames.find(game => game.id === gameId) || mockNCAAGames[0] || null;
    }

    try {
      const response = await fetch(
        `${ESPN_BASE_URL}/college-football/scoreboard/${gameId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching extra NCAA game ${gameId}:`, error);
      return null;
    }
  }

  async fetchExtraNCAATeamGames(teamIds: number[]): Promise<ESPNEvent[]> {
    if (isTestingMode()) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return [...mockExtraGames];
    }

    const promises = teamIds.map(async (teamId) => {
      try {
        const response = await fetch(
          `${ESPN_BASE_URL}/college-football/teams/${teamId}/schedule`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.events?.filter((event: ESPNEvent) => {
          const eventDate = new Date(event.competitions?.[0]?.date || '');
          const now = new Date();
          const daysDiff = Math.abs(now.getTime() - eventDate.getTime()) / (1000 * 3600 * 24);
          return daysDiff <= 7;
        }) || [];
      } catch (error) {
        console.error(`Error fetching team ${teamId} games:`, error);
        return [];
      }
    });

    const results = await Promise.all(promises);
    return results.flat();
  }

  async fetchAllGames(extraTeamIds: number[] = []): Promise<{
    ncaaGames: ESPNEvent[];
    nflGames: ESPNEvent[];
    extraGames: ESPNEvent[];
  }> {
    try {
      const [ncaaGames, nflGames, extraGames] = await Promise.all([
        this.fetchNCAAgames(),
        this.fetchNFLGames(),
        extraTeamIds.length > 0 ? this.fetchExtraNCAATeamGames(extraTeamIds) : Promise.resolve([])
      ]);

      return {
        ncaaGames,
        nflGames,
        extraGames
      };
    } catch (error) {
      console.error('Error fetching all games:', error);
      return {
        ncaaGames: [],
        nflGames: [],
        extraGames: []
      };
    }
  }
}

export const espnApi = ESPNApiService.getInstance();
