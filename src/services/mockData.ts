import { ESPNEvent } from '../types';

import mockNcaaGamesData from '../data/mockNcaaGames.json';
import mockNflGamesData from '../data/mockNflGames.json';
import mockExtraGamesData from '../data/mockExtraGames.json';

export const mockNCAAGames: ESPNEvent[] = mockNcaaGamesData as unknown as ESPNEvent[];
export const mockNFLGames: ESPNEvent[] = mockNflGamesData as unknown as ESPNEvent[];
export const mockExtraGames: ESPNEvent[] = mockExtraGamesData as unknown as ESPNEvent[];
