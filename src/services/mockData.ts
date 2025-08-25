import { ESPNEvent } from '../types';

// Import actual ESPN API responses from JSON files
import mockNcaaGamesData from '../data/mockNcaaGames.json';
import mockNflGamesData from '../data/mockNflGames.json';
import mockExtraGamesData from '../data/mockExtraGames.json';

// Export the mock data with proper typing - using unknown first to handle type mismatch
export const mockNCAAGames: ESPNEvent[] = mockNcaaGamesData as unknown as ESPNEvent[];
export const mockNFLGames: ESPNEvent[] = mockNflGamesData as unknown as ESPNEvent[];
export const mockExtraGames: ESPNEvent[] = mockExtraGamesData as unknown as ESPNEvent[];
