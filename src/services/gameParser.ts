import { Game, Team, ESPNEvent, ESPNCompetition, ESPNCompetitor, GameLeaders, PlayerStat } from '../types';

export class GameParser {
  static parseGame(event: ESPNEvent, isNfl: boolean): Game | null {
    try {
      const comp = this.parseCompetition(event);
      if (!comp) return null;

      const game: Game = {
        id: comp.id,
        state: this.parseState(event),
        link: this.parseLink(event),
        venue: comp.venue.fullName,
        date: this.parseDate(event),
        dateString: '',
        timeString: '',
        channel: this.parseChannel(comp),
        odds: this.parseOdds(comp),
        topHeader: '',
        isNfl,
        lastPlay: this.parseLastPlay(comp),
        info: '',
        situation: {
          yardLine: this.parseYardLine(comp),
          downDistanceText: this.parseDownAndDist(comp),
          possession: this.parsePossession(comp),
          isRedZone: this.parseIsRedZone(comp),
          distance: this.parseDistance(comp)
        },
        leaders: this.parseLeaders(comp),
        away: this.parseTeam(1, comp),
        home: this.parseTeam(0, comp),
        live: ''
      };

      game.dateString = this.formatDateString(game.date);
      game.timeString = this.formatTimeString(game.date);
      game.topHeader = this.formatTopHeader(game);
      game.info = this.formatInfo(game);

      this.formatGameGivenState(event, game);

      return game;
    } catch (error) {
      console.error('Error parsing game:', error);
      return null;
    }
  }

  private static parseCompetition(event: ESPNEvent): ESPNCompetition | null {
    return event.competitions?.[0] || null;
  }

  private static parseState(event: ESPNEvent): string {
    return event.status?.type?.state || '';
  }

  private static parseLink(event: ESPNEvent): string {
    return event.links?.[0]?.href || '';
  }

  private static parseDate(event: ESPNEvent): Date {
    return new Date(event.competitions?.[0]?.date || new Date());
  }

  private static formatDateString(date: Date): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  private static formatTimeString(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  private static parseChannel(comp: ESPNCompetition): string {
    return comp.broadcasts?.[0]?.names?.[0] || '';
  }

  private static parseOdds(comp: ESPNCompetition): string {
    return comp.odds?.[0]?.details || '';
  }

  private static formatTopHeader(game: Game): string {
    return `${game.channel} • ${game.venue}`;
  }


  private static parseLastPlay(comp: ESPNCompetition): string {
    return comp.situation?.lastPlay?.text || '';
  }

  private static parseDownAndDist(comp: ESPNCompetition): string {
    return comp.situation?.downDistanceText || '';
  }

  private static formatInfo(game: Game): string {
    return game.situation?.downDistanceText || game.lastPlay || '';
  }

  private static parsePossession(comp: ESPNCompetition): string {
    return comp.situation?.possession || '';
  }

  private static parseIsRedZone(comp: ESPNCompetition): boolean {
    return comp.situation?.isRedZone || false;
  }

  private static parseTeam(isAway: number, comp: ESPNCompetition): Team {
    const rawTeam = comp.competitors[isAway];
    
    return {
      id: rawTeam.id,
      name: rawTeam.team.shortDisplayName,
      searchName: rawTeam.team.displayName.toLowerCase().replace(/\s/g, ''),
      score: Number(rawTeam.score) || 0,
      record: this.parseRecord(rawTeam),
      rank: this.parseRank(rawTeam),
      primary: this.parseColor(rawTeam, true),
      alternate: this.parseColor(rawTeam, false),
      conference: this.parseConference(rawTeam),
      img: this.parseImg(rawTeam)
    };
  }

  private static parseRecord(rawTeam: ESPNCompetitor): string {
    return rawTeam.records?.[0]?.summary || '';
  }

  private static parseRank(rawTeam: ESPNCompetitor): string {
    const rank = rawTeam.curatedRank?.current;
    return (rank && rank !== 99) ? rank.toString() : '';
  }

  private static parseColor(rawTeam: ESPNCompetitor, isPrimary: boolean): string {
    const color = isPrimary ? rawTeam.team.color : rawTeam.team.alternateColor;
    return color || '777777';
  }

  private static parseConference(rawTeam: ESPNCompetitor): string | undefined {
    const id = Number(rawTeam.team.conferenceId);
    const conferenceMap: { [key: number]: string } = {
      5: 'big10',
      8: 'sec',
      4: 'big12',
      1: 'acc'
    };
    return conferenceMap[id];
  }

  private static parseImg(rawTeam: ESPNCompetitor): string {
    return rawTeam.team.logo?.replace('500', '500-dark') || rawTeam.team.logos?.[0]?.href?.replace('500', '500-dark') || '';
  }
  
  private static parseYardLine(comp: ESPNCompetition): number {
    return comp.situation?.yardLine ?? 50;
  }

  private static parseDistance(comp: ESPNCompetition): number {
    return comp.situation?.distance ?? 50;
  }

  private static formatGameGivenState(event: ESPNEvent, game: Game): void {
    const state = event.status?.type?.state;
    
    if (state === 'pre') {
      game.live = 'upcoming';
    } else if (state === 'in') {
      game.live = 'live';
      const period = event.status?.period || 1;
      const clock = event.status?.displayClock || '';
      game.info = `${this.numToQuart(period)} ${clock}`;
    } else if (state === 'post') {
      game.live = 'final';
      game.info = 'Final';
    }
  }

  private static numToQuart(num: number): string {
    const quarters = ['', '1st', '2nd', '3rd', '4th'];
    return quarters[num] || `${num}th`;
  }

  private static parseLeaders(comp: ESPNCompetition): GameLeaders | undefined {
    const leaders = (comp as any).leaders;
    if (!leaders || !Array.isArray(leaders)) return undefined;

    const gameLeaders: GameLeaders = {};

    for (const leader of leaders) {
      if (leader.name === 'passingYards' && leader.leaders?.[0]) {
        gameLeaders.passingYards = this.parsePlayerStat(leader.leaders[0]);
      } else if (leader.name === 'rushingYards' && leader.leaders?.[0]) {
        gameLeaders.rushingYards = this.parsePlayerStat(leader.leaders[0]);
      } else if (leader.name === 'receivingYards' && leader.leaders?.[0]) {
        gameLeaders.receivingYards = this.parsePlayerStat(leader.leaders[0]);
      }
    }

    return Object.keys(gameLeaders).length > 0 ? gameLeaders : undefined;
  }

  private static parsePlayerStat(leader: any): PlayerStat {
    return {
      displayValue: leader.displayValue || '',
      value: leader.value || 0,
      athlete: {
        id: leader.athlete?.id || '',
        fullName: leader.athlete?.fullName || '',
        displayName: leader.athlete?.displayName || '',
        shortName: leader.athlete?.shortName || '',
        headshot: leader.athlete?.headshot || '',
        jersey: leader.athlete?.jersey || '',
        position: {
          abbreviation: leader.athlete?.position?.abbreviation || ''
        },
        team: {
          id: leader.athlete?.team?.id || ''
        }
      },
      team: {
        id: leader.team?.id || ''
      }
    };
  }

}
