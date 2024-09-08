function Game(event, isNfl) {
    try {
        var comp = parseCompetition(event);
        if (comp === undefined) return;
        this.id = comp.id;
        this.state = parseState(event);
        this.link = parseLink(event);
        this.venue = comp.venue.fullName;
        this.date = parseDate(event, comp);
        this.dateString = formatDateString(this.date);
        this.timeString = formatTimeString(this.date);
        this.channel = parseChannel(comp);
        this.odds = parseOdds(comp);
        this.topHeader = formatTopHeader(this);
        this.isNfl = isNfl;
        this.ncaaIcon = getIconClass(isNfl, "ncaa");
        this.nflIcon = getIconClass(isNfl, "nfl");
        this.lastPlay = parseLastPlay(comp);
        this.downAndDist = parseDownAndDist(comp);
        this.info = formatInfo(this);
        this.possession = parsePossession(comp);
        this.isRedZone = parseIsRedZone(comp);
        this.away = new Team(1, comp, this);
        this.home = new Team(0, comp, this);
        this.isGood = bothTeamsRanked(this);
        this.isClose = this.isRedZone;
        this.isFavorite = containsFavorite(this);
        this.live = "";
        this.spot = "";
        this.first = "";
        this.fieldProgress = "";
        this.possessionColor = "";
        this.fieldProgress = "remove";
        this.progressColor = "var(--text)"
        formatGameGivenState(event, this);
    } catch (err) {
        throw err;
    }
}

function parseCompetition(event) {
    if (event.competitions === undefined) return undefined;
    return event.competitions[0];
}

function parseState(event) {
    return event.status !== undefined ? event.status.type.state : "pre";
}

function parseLink(event) {
    return event.links !== undefined ? event.links[0].href : "";
}

function parseDate(event, comp) {
    return new Date(comp.startDate !== undefined ? comp.startDate : event.date);
}

function formatDateString(date) {
    return date.toLocaleDateString([], {
        weekday: "long",
        month: "numeric",
        day: "numeric",
    });
}

function formatTimeString(date) {
    return date.toLocaleTimeString([], {
        timeStyle: "short",
    });
}

function parseChannel(comp) {
    return comp.broadcasts[0] !== undefined ? comp.broadcasts[0].names.join("/") : "";
}

function parseOdds(comp) {
    if (comp.odds !== undefined) {
        return "(" + [comp.odds[0].details, comp.odds[0].overUnder].filter(Boolean).join(" O/U ") + ")";
    }
    return undefined;
}

function formatTopHeader(game) {
    // return [game.channel, game.venue, game.odds].filter(Boolean).join(" - ");
    return [game.channel, game.odds].filter(Boolean).join(" ");
}

function getIconClass(isNfl, league) {
    if (league === "ncaa") return isNfl ? "remove" : "";
    return isNfl ? "" : "remove";
}

function parseLastPlay(comp) {
    if (comp.situation === undefined) return undefined;
    return comp.situation.lastPlay !== undefined ? comp.situation.lastPlay.text : "";
}

function parseDownAndDist(comp) {
    if (comp.situation === undefined) return undefined;
    return comp.situation.downDistanceText !== undefined ? comp.situation.downDistanceText : "";
}

function formatInfo(game) {
    return [game.downAndDist, game.lastPlay].filter(Boolean).join(" - ");
}

function parsePossession(comp) {
    if (comp.situation === undefined) return undefined;
    return comp.situation.possession !== undefined ? comp.situation.possession : " ";
}

function parsePossessionColor(game) {
    if (game.possession == game.home.id) return game.home.primary;
    return game.away.primary;
}

function parseIsRedZone(comp) {
    if (comp.situation === undefined) return undefined;
    return comp.situation.isRedZone;
}

function formatGameGivenState(event, game) {
    if (game.state == "pre") {
        game.time = " ";
        game.quarter = " ";
    } else if (game.state == "post") {
        game.time = " ";
        game.quarter = "Final";
    } else if (game.state == "in") {

        if (event.status.type.name === "STATUS_HALFTIME") {
            game.isRedZone = false;
            game.info = " ";
            game.time = " ";
            game.quarter = "Half";
            game.home.timeouts = "remove";
            game.away.timeouts = "remove";
        } else {

            game.time = event.status.displayClock == "0:00" ? "End of" : event.status.displayClock;
            game.quarter = numToQuart(event.status.period);

            if (game.home.possession !== "remove" || game.away.possession !== "remove") {
                game.spot = event.competitions[0].situation.yardLine;
                game.first = game.spot + event.competitions[0].situation.distance;
                game.fieldProgress = "show";
                game.possessionColor = parsePossessionColor(game);

            }

            if (event.status.clock <= 120 && (event.status.period == 2 || event.status.period == 4)) {
                game.progressColor = "var(--red)";
            }
        }
        game.live = "live-game";
    }
}

// convert number to quarter string
function numToQuart(num) {
    if (num === 4) return "4th";
    if (num === 3) return "3rd";
    if (num === 2) return "2nd";
    if (num === 1) return "1st";
    if (num === 0) return "";
    return "OT";
}

// do both teams have high win percentage
function bothHighWinPercent(game) {
    var threshold = 0.69;
    return getWinPercent(game.away) > threshold && getWinPercent(game.home) > threshold;
}

// is the game close towards the end
function isCloseGame(game) {
    return (
        Math.abs(Number(game.home.score) - Number(game.away.score)) < 9 &&
        (game.quarter == "3rd" || game.quarter == "4th" || game.quarter == "OT")
    );
}

// does the game contain a favorite team
function containsFavorite(game) {
    if (!game.isNfl && (game.home.id === "66" || game.away.id === "66")) return true;
    if (game.isNfl && (game.home.id === "6" || game.away.id === "6")) return true;
    return false;
}

// does the game contain an extra team
function containsExtra(game, extraTeams) {
    if (game.isNfl) return false;
    for (var i = 0; i < extraTeams.length; i++) {
        if (Number(game.home.id) === extraTeams[i] || Number(game.away.id) === extraTeams[i]) return true;
    }
}

// does the game contain a team in a conf
function containsConference(game, conf) {
    if (game.isNfl) return false;
    for (var i = 0; i < extraTeams.length; i++) {
        if (game.home.conference === conf || game.away.conference === conf) return true;
    }
}

// is one team ranked
function oneTeamRanked(game) {
    return isRanked(game.home) || isRanked(game.away);
}

// are both teams ranked
function bothTeamsRanked(game) {
    return isRanked(game.home) && isRanked(game.away);
}

// log the number of timeouts
function logTimeouts(comp) {
    if (comp.situation === undefined) return;
    console.log(this.venue, comp.situation.awayTimeouts, comp.situation.homeTimeouts);
}
