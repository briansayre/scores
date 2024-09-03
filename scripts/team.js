function Team(isAway, comp, game) {
    var rawTeam = comp.competitors[isAway];
    this.id = rawTeam.id;
    this.name = rawTeam.team.shortDisplayName;
    this.score = rawTeam.score;
    this.record = parseRecord(rawTeam);
    this.rank = parseRank(rawTeam);
    this.primary = parseColor(rawTeam, 1);
    this.alternate = parseColor(rawTeam, 0);
    this.possession = "remove";
    this.timeouts = "remove";
    this.timeoutIcons = ["hide", "hide", "hide"];
    this.timeoutCount = 0;
    formatTeamGivenState(this, isAway, comp, game);
}

function parseRecord(rawTeam) {
    return rawTeam.records !== undefined ? rawTeam.records[0].summary : "";
}

function parseRank(rawTeam) {
    var rank = "";
    if (rawTeam.curatedRank !== undefined) rank = rawTeam.curatedRank.current;
    if (rank === 99) rank = "";
    return rank;
}

function parseColor(rawTeam, isPrimary) {
    var color = isPrimary ? rawTeam.team.color : rawTeam.team.alternateColor;
    if (color === undefined) color = "777777";
    return color;
}

function formatTeamGivenState(team, isAway, comp, game) {
    if (game.state == "pre") {
        team.score = " ";
    } else if (game.state == "in") {
        if (game.isNfl)
            this.timeoutCount = isAway
                ? comp.situation.awayTimeouts
                : comp.situation.homeTimeouts;
        for (let i = 0; i < this.timeoutCount; i++) {
            team.timeoutIcons[i] = "show";
            team.timeouts = "show";
        }
    }
}

// get a teams win percentage
function getWinPercent(team) {
    var indexOfDash = team.record.indexOf("-");
    if (indexOfDash === -1) return -1;
    var wins = Number(team.record.substring(0, indexOfDash));
    var losses = Number(team.record.substring(indexOfDash + 1));
    var total = wins + losses;
    if (total === 0) return -1;
    return wins / total;
}

// return true if team is ranked in top 25, false otherwise
function isRanked(team) {
    return team.rank !== "";
}
