// NFL Division lookup table mapping team IDs to their divisions
export const NFL_DIVISIONS: { [teamId: string]: string } = {
  // AFC East
  '2': 'afc_east',   // Buffalo Bills
  '15': 'afc_east',  // Miami Dolphins
  '17': 'afc_east',  // New England Patriots
  '20': 'afc_east',  // New York Jets

  // AFC North
  '33': 'afc_north', // Baltimore Ravens
  '4': 'afc_north',  // Cincinnati Bengals
  '5': 'afc_north',  // Cleveland Browns
  '23': 'afc_north', // Pittsburgh Steelers

  // AFC South
  '11': 'afc_south', // Houston Texans
  '18': 'afc_south', // Indianapolis Colts
  '30': 'afc_south', // Jacksonville Jaguars
  '10': 'afc_south', // Tennessee Titans

  // AFC West
  '7': 'afc_west',   // Denver Broncos
  '12': 'afc_west',  // Kansas City Chiefs
  '13': 'afc_west',  // Las Vegas Raiders
  '24': 'afc_west',  // Los Angeles Chargers

  // NFC East
  '6': 'nfc_east',   // Dallas Cowboys
  '19': 'nfc_east',  // New York Giants
  '21': 'nfc_east',  // Philadelphia Eagles
  '28': 'nfc_east',  // Washington Commanders

  // NFC North
  '3': 'nfc_north',  // Chicago Bears
  '8': 'nfc_north',  // Detroit Lions
  '9': 'nfc_north',  // Green Bay Packers
  '16': 'nfc_north', // Minnesota Vikings

  // NFC South
  '1': 'nfc_south',  // Atlanta Falcons
  '29': 'nfc_south', // Carolina Panthers
  '31': 'nfc_south', // New Orleans Saints
  '27': 'nfc_south', // Tampa Bay Buccaneers

  // NFC West
  '22': 'nfc_west',  // Arizona Cardinals
  '14': 'nfc_west',  // Los Angeles Rams
  '25': 'nfc_west',  // San Francisco 49ers
  '26': 'nfc_west'   // Seattle Seahawks
};

/**
 * Get the NFL division for a given team ID
 */
export const getNflDivision = (teamId: string): string | undefined => {
  return NFL_DIVISIONS[teamId];
};
