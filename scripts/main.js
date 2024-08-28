// set a cookie value
function setCookie(cName, cValue, expirationDays) {
    const d = new Date();
    d.setTime(d.getTime() + expirationDays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cName + "=" + cValue + ";" + expires + ";path=/";
}

// get a cookie value
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
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

// are both teams ranked
function bothRanked(game) {
    return (game.home.rank !== "" && game.away.rank !== "");
}

// get a teams win percentage
function getWinPercent(team) {
    var indexOfDash = team.record.indexOf("-");
    if (indexOfDash === -1) return -1;
    var wins = Number(team.record.substring(0, indexOfDash));
    var losses = Number(team.record.substring(indexOfDash + 1));
    var total = wins + losses
    if (total === 0) return -1;
    return wins / total;
}

// do both teams have high win percentage
function bothHighWinPercent(game) {
    var threshold = .69;
    return (getWinPercent(game.away) > threshold && getWinPercent(game.home) > threshold);
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

// render a date or time
function renderDateOrTime(value, className) {
    var htmlObject = document.createElement("div");
    htmlObject.classList.add(className);
    htmlObject.innerHTML = value;
    document.getElementById("container").appendChild(htmlObject);
}

// given a game, render the div
function renderGame(game) {
    var htmlObject = document.createElement("div");

    htmlObject.classList.add("game");
    if (game.isClose) {
        htmlObject.classList.add("close-game");
    } else if (game.isGood) {
        htmlObject.classList.add("good-game");
    } else if (game.isFavorite) {
        htmlObject.classList.add("favorite-game");
    }

    htmlObject.onclick = function () {
        window.open(game.link);
    };

    var htmlString = `
        <div class="network">
            <i class="${game.live}"></i>${game.topHeader}
        </div>
        <div class="scores">
            <div class="teams">
                <div class="team away">
                    <div class="team-logo">
                        <svg width="32" height="32" class="${game.ncaaIcon}">
                            <rect class="logo-background" x="0" y="0" rx="3" ry="3" width="32" height="32" fill="#${game.away.primary}"/>
                            <rect class="stripe" x="12" y="0" width="8" height="32" fill="#${game.away.alternate}"/>
                            <rect class="stripe" x="9" y="0" width="3" height="32" fill="white"/>
                            <rect class="stripe" x="20" y="0" width="3" height="32" fill="white"/>
                        </svg>
                        <svg width="32" height="32" class="${game.nflIcon}">
                            <rect class="logo-background" x="0" y="0" rx="3" ry="3" width="32" height="32" fill="#${game.away.primary}"/>
                            <circle class="stripe"  cx="16" cy="16" r="8" fill="#${game.away.alternate}" stroke="white" stroke-width="3"/>
                        </svg>
                    </div>
                    <div class="team-name">
                        ${game.away.name} <span class="rank">${game.away.rank}</span>
                        <div class="team-info">
                            ${game.away.record} ${game.away.downAndDist}
                        </div>
                    </div>
                    <div class="score-icons">
                        <div class="timeouts">
                            <svg class="${game.away.timeouts[2]}" width="6" height="6">
                                <circle cx="3" cy="3" r="3" />
                            </svg>
                            <svg class="${game.away.timeouts[1]}" width="6" height="6">
                                <circle cx="3" cy="3" r="3" />
                            </svg>
                            <svg class="${game.away.timeouts[0]}" width="6" height="6">
                                <circle cx="3" cy="3" r="3" />
                            </svg>
                        </div>
                        <div class="possession">
                            <svg class="${game.away.possession}" width="10" height="6">
                                <ellipse cx="5" cy="3" rx="5" ry="3" />
                            </svg>
                        </div>
                    </div>
                    <div class="score">
                        ${game.away.score}
                    </div>
                </div>
                <div class="team home">
                    <div class="team-logo">
                        <svg width="32" height="32" class="${game.ncaaIcon}">
                            <rect class="logo-background" x="0" y="0" rx="3" ry="3" width="32" height="32" fill="#${game.home.primary}"/>
                            <rect class="stripe" x="12" y="0" width="8" height="32" fill="#${game.home.alternate}"/>
                            <rect class="stripe" x="9" y="0" width="3" height="32" fill="white"/>
                            <rect class="stripe" x="20" y="0" width="3" height="32" fill="white"/>
                        </svg>
                        <svg width="32" height="32" class="${game.nflIcon}">
                            <rect class="logo-background" x="0" y="0" rx="3" ry="3" width="32" height="32" fill="#${game.home.primary}"/>
                            <circle class="stripe"  cx="16" cy="16" r="8" fill="#${game.home.alternate}" stroke="white" stroke-width="3" />
                        </svg>
                    </div>
                    <div class="team-name">
                        ${game.home.name} <span class="rank">${game.home.rank}</span>
                        <div class="team-info">
                            ${game.home.record} ${game.home.downAndDist}
                        </div>
                    </div>
                    <div class="score-icons">
                        <div class="timeouts">
                            <svg class="${game.home.timeouts[2]}" width="6" height="6">
                                <circle cx="3" cy="3" r="3" />
                            </svg>
                            <svg class="${game.home.timeouts[1]}" width="6" height="6">
                                <circle cx="3" cy="3" r="3" />
                            </svg>
                            <svg class="${game.home.timeouts[0]}" width="6" height="6">
                                <circle cx="3" cy="3" r="3" />
                            </svg>
                        </div>
                        <div class="possession">
                            <svg class="${game.home.possession}" width="10" height="6">
                                <ellipse cx="5" cy="3" rx="5" ry="3" />
                            </svg>
                        </div>
                    </div>
                    <div class="score">
                        ${game.home.score}
                    </div>
                </div>
            </div>
            <div class="progress">
                <div class="time">
                    ${game.time}
                </div>
                <div class="quarter">
                    ${game.quarter}
                </div>
            </div>
        </div>
        <div class="last-play">
            ${game.lastPlay}
        </div>
    `;
    htmlObject.innerHTML = htmlString;
    document.getElementById("container").appendChild(htmlObject);
}

// parse the team from the response
function getTeam(isAway, comp, game) {
    var t = comp.competitors[isAway];
    var team = {};
    var state = game.state;

    team.id = t.id;
    team.name = t.team.shortDisplayName;
    team.record = t.records !== undefined ? t.records[0].summary : "";
    team.possession = "hide";
    team.timeouts = ["hide", "hide", "hide"];
    team.timeoutCount = 3; // TODO: get timeout number
    team.score = t.score;
    team.rank = t.curatedRank !== undefined ? t.curatedRank.current : "";
    team.rank = team.rank !== 99 ? team.rank : "";
    team.primary = t.team.color;
    team.primary = team.primary !== undefined ? team.primary : "777777";
    team.alternate = t.team.alternateColor;
    team.alternate = team.alternate !== undefined ? team.alternate : "777777";
    team.downAndDist = "";

    if (state == "pre") {
        team.score = "-";
    } else if (state == "post") {

    } else {
        if (team.id == game.possession) {
            team.downAndDist = game.downAndDist;
            team.possession = "show";
        }
        for (let i = 0; i < team.timeoutCount; i++) {
            team.timeouts[i] = "show";
        }
    }

    return team;
}

// parse the game from the response
function getGame(event, isNfl) {
    var game = {};
    try {
        var comp = event.competitions !== undefined ? event.competitions[0] : {};
        if (comp == {}) return;

        game.state = event.status !== undefined ? event.status.type.state : "pre";
        game.link = event.links !== undefined ? event.links[0].href : "";
        game.venue = comp.venue.fullName;
        game.date = new Date(comp.startDate !== undefined ? comp.startDate : event.date);
        game.dateString = game.date.toLocaleDateString([], { weekday: "long", month: "numeric", day: "numeric" })
        game.timeString = game.date.toLocaleTimeString([], { timeStyle: "short" });
        game.channel = comp.broadcasts[0].names !== undefined ? comp.broadcasts[0].names.join("/") : "";
        game.odds = comp.odds !== undefined ? " (" + comp.odds[0].details + (comp.odds[0].overUnder !== undefined ? " O/U " + comp.odds[0].overUnder + ")" : ")") : "";
        game.topHeader = [game.channel, game.venue, game.odds].filter(Boolean).join(" - ");
        game.lastPlay = " ";
        game.downAndDist = " ";
        game.possession = " ";
        game.live = " ";
        game.isNfl = isNfl;
        game.ncaaIcon = isNfl ? "remove" : "";
        game.nflIcon = isNfl ? "" : "remove";

        if (comp.situation !== undefined) {
            console.log(comp.situation);
            game.lastPlay = comp.situation.lastPlay !== undefined ? comp.situation.lastPlay.text : " ";
            game.downAndDist = comp.situation.downDistanceText !== undefined ? comp.situation.downDistanceText : " ";
            game.possession = comp.situation.possession !== undefined ? comp.situation.possession : " ";
        }

        if (game.state == "pre") {
            game.time = " ";
            game.quarter = " ";
        } else if (game.state == "post") {
            game.time = " ";
            game.quarter = "Final";
        } else {
            game.time = event.status.displayClock;
            game.quarter = numToQuart(event.status.period);
            game.live = "fa fa-circle text-danger-glow blink";
            console.log(g);
        }

        game.away = getTeam(1, comp, game);
        game.home = getTeam(0, comp, game);

        if (isCloseGame(game)) {
            game.isClose = true;
        } else if (bothRanked(game) || bothHighWinPercent(game)) {
            game.isGood = true;
        } else if (containsFavorite(game)) {
            game.isFavorite = true;
        }

    } catch (err) {
        console.log(err);
    }

    return game;
}

var games = [];
var requests = [];
var extraGameRequests = [];
var extraGames = [];
var extraTeams = [66, 38, 2460, 2294];

// ncaa
requests.push(
    $.ajax({
        url: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
        type: "GET",
        dataType: "json",
        success: function (res) {
            console.log(res);
            for (let i = 0; i < res.events.length; i++) {
                game = getGame(res.events[i], 0);
                if (game !== undefined) {
                    games.push(game);
                }
            }
        },
    })
);

// nfl
requests.push(
    $.ajax({
        url: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
        type: "GET",
        dataType: "json",
        success: function (res) {
            console.log(res);
            for (let i = 0; i < res.events.length; i++) {
                game = getGame(res.events[i], 1);
                if (game !== undefined) {
                    games.push(game);
                }
            }
        },
    })
);

// extra teams
for (let i = 0; i < extraTeams.length; i++) {
    requests.push(
        $.ajax({
            url: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/".concat(extraTeams[i]),
            type: "GET",
            dataType: "json",
            success: function (res) {
                var rank = res.team.rank !== undefined ? res.team.rank : 99;
                if (rank > 25 && res.team.nextEvent !== undefined) {
                    id = res.team.nextEvent[0].id;
                    extraGames.push(id);
                }
            },
        })
    );
}

// when ncaa, nfl, and extra teams are done, do extra games
$.when.apply($, requests).done(function () {
    // get extra games
    for (let i = 0; i < extraGames.length; i++) {
        extraGameRequests.push(
            $.ajax({
                url: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard/".concat(
                    extraGames[i]
                ),
                type: "GET",
                dataType: "json",
                success: function (res) {
                    game = getGame(res, 0);
                    if (game !== undefined) {
                        games.push(game);
                    }
                },
            })
        );
    }
    // now render the games
    $.when.apply($, extraGameRequests).done(function () {
        games.sort(function (a, b) {
            return a.date - b.date;
        });

        var prevDate = "";
        var prevTime = "";

        for (let i = 0; i < games.length; i++) {
            if (games[i].dateString !== prevDate) {
                renderDateOrTime(games[i].dateString, "game-date");
                prevDate = games[i].dateString;
                prevTime = "";
            }
            if (games[i].timeString !== prevTime) {
                renderDateOrTime(games[i].timeString, "game-time");
                prevTime = games[i].timeString;
            }
            renderGame(games[i]);
        }

        $(document).ready(function () {
            document.getElementById("container").style.visibility = "visible";
            document.getElementById("loading").style.display = "none";

            var scrollPos = getCookie("scrollPos");
            if (scrollPos) window.scrollTo(0, scrollPos);

            window.onbeforeunload = function (e) {
                setCookie("scrollPos", window.scrollY, 14);
            };
        });
    });
});
