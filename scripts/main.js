var games = [];
var shownGames = [];
var requests = [];
var extraGameRequests = [];
var extraGames = [];

// set a cookie value
function setCookie(cName, cValue, expirationDays) {
    const d = new Date();
    d.setTime(d.getTime() + expirationDays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
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
    return game.home.rank !== "" && game.away.rank !== "";
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

// do both teams have high win percentage
function bothHighWinPercent(game) {
    var threshold = 0.69;
    return (
        getWinPercent(game.away) > threshold &&
        getWinPercent(game.home) > threshold
    );
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
    if (!game.isNfl && (game.home.id === "66" || game.away.id === "66"))
        return true;
    if (game.isNfl && (game.home.id === "6" || game.away.id === "6"))
        return true;
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
                        ${game.away.name}
                        <span class="rank">${game.away.rank}</span>
                        <span class="possession-icon ${game.away.possession}"></span>
                        <div class="team-info">
                            ${game.away.record}
                        </div>
                    </div>
                    <div class="score-icons">
                        <div class="timeouts ${game.away.timeout}">
                            <div class="${game.away.timeouts[2]} timeout"></div>
                            <div class="${game.away.timeouts[1]} timeout"></div>
                            <div class="${game.away.timeouts[0]} timeout"></div>
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
                        ${game.home.name} 
                        <span class="rank">${game.home.rank}</span> 
                        <span class="possession-icon ${game.home.possession}"></span>
                        <div class="team-info">
                            ${game.home.record}
                        </div>
                    </div>
                    <div class="score-icons">
                        <div class="timeouts ${game.home.timeout}">
                            <div class="${game.home.timeouts[2]} timeout"></div>
                            <div class="${game.home.timeouts[1]} timeout"></div>
                            <div class="${game.home.timeouts[0]} timeout"></div>
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
            ${game.info}
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
    team.possession = "remove";
    team.timeouts = ["hide", "hide", "hide"];
    team.timeout = "remove";
    team.timeoutCount = 0;
    team.score = t.score;
    team.rank = t.curatedRank !== undefined ? t.curatedRank.current : "";
    team.rank = team.rank !== 99 ? team.rank : "";
    team.primary = t.team.color;
    team.primary = team.primary !== undefined ? team.primary : "777777";
    team.alternate = t.team.alternateColor;
    team.alternate = team.alternate !== undefined ? team.alternate : "777777";
    team.downAndDist = "";

    if (state == "pre") {
        team.score = " ";
    } else if (state == "post") {
    } else if (state == "in") {
        if (team.id == game.possession) {
            team.downAndDist = game.downAndDist;
            team.possession = "show";
        }
        // team.timeoutCount = isAway ? comp.situation.awayTimeouts : comp.situation.homeTimeouts
        for (let i = 0; i < team.timeoutCount; i++) {
            team.timeouts[i] = "show";
            team.timeout = "show";
        }
    }

    return team;
}

// parse the game from the response
function getGame(event, isNfl) {
    var game = {};
    try {
        var comp =
            event.competitions !== undefined ? event.competitions[0] : {};
        if (comp == {}) return;

        game.state =
            event.status !== undefined ? event.status.type.state : "pre";
        game.link = event.links !== undefined ? event.links[0].href : "";
        game.venue = comp.venue.fullName;
        game.date = new Date(
            comp.startDate !== undefined ? comp.startDate : event.date
        );
        game.dateString = game.date.toLocaleDateString([], {
            weekday: "long",
            month: "numeric",
            day: "numeric",
        });
        game.timeString = game.date.toLocaleTimeString([], {
            timeStyle: "short",
        });
        game.channel =
            comp.broadcasts[0].names !== undefined
                ? comp.broadcasts[0].names.join("/")
                : "";
        if (comp.odds !== undefined) {
            game.odds =
                "(" +
                [comp.odds[0].details, comp.odds[0].overUnder]
                    .filter(Boolean)
                    .join(" O/U ") +
                ")";
        }
        game.topHeader = [game.channel, game.venue, game.odds]
            .filter(Boolean)
            .join(" - ");
        game.possession = " ";
        game.live = " ";
        game.isNfl = isNfl;
        game.ncaaIcon = isNfl ? "remove" : "";
        game.nflIcon = isNfl ? "" : "remove";

        if (comp.situation !== undefined) {
            console.log(
                game.venue,
                comp.situation.awayTimeouts,
                comp.situation.homeTimeouts
            );
            game.lastPlay =
                comp.situation.lastPlay !== undefined
                    ? comp.situation.lastPlay.text
                    : undefined;
            game.downAndDist = comp.situation.downDistanceText;
            game.info = [game.downAndDist, game.lastPlay]
                .filter(Boolean)
                .join(" - ");
            game.possession =
                comp.situation.possession !== undefined
                    ? comp.situation.possession
                    : " ";
            game.isRedZone = comp.situation.isRedZone;
        } else {
            game.info = " ";
        }

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
            } else {
                game.time =
                    event.status.displayClock == "0:00"
                        ? "End of"
                        : event.status.displayClock;
                game.quarter = numToQuart(event.status.period);
            }
            game.live = "fa fa-circle text-danger-glow blink";
        }

        game.away = getTeam(1, comp, game);
        game.home = getTeam(0, comp, game);

        if (game.isRedZone) {
            game.isClose = true;
        } else if (bothRanked(game) || bothHighWinPercent(game)) {
            game.isGood = true;
        } else if (containsFavorite(game)) {
            game.isFavorite = true;
        }
    } catch (err) {
        alert(err);
    }
    return game;
}

// render the games given a filter mode
function renderGames(filter, clearScreen) {
    if (clearScreen) clearGamesScreen();

    shownGames = games
        .filter(function (game) {
            if (filter == "both") return 1;
            if (game.isNfl && filter == "nfl") return 1;
            if (!game.isNfl && filter == "ncaa") return 1;
            return 0;
        })
        .sort(function (a, b) {
            return a.date - b.date;
        });

    var prevDate = "";
    var prevTime = "";

    for (let i = 0; i < shownGames.length; i++) {
        if (shownGames[i].dateString !== prevDate) {
            renderDateOrTime(shownGames[i].dateString, "game-date");
            prevDate = shownGames[i].dateString;
            prevTime = "";
        }
        if (shownGames[i].timeString !== prevTime) {
            renderDateOrTime(shownGames[i].timeString, "game-time");
            prevTime = shownGames[i].timeString;
        }
        renderGame(shownGames[i]);
    }
}

// request ncaa games
function requestNcaaGames() {
    requests.push(
        $.ajax({
            url: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
            type: "GET",
            dataType: "json",
            cache: false,
            success: function (res) {
                for (let i = 0; i < res.events.length; i++) {
                    game = getGame(res.events[i], 0);
                    if (game !== undefined) {
                        games.push(game);
                    }
                }
            },
        })
    );
}

// request the extra teams
function requestExtraNcaaTeams() {
    var extraTeams = [66, 38, 2460, 2294, 275];

    for (let i = 0; i < extraTeams.length; i++) {
        requests.push(
            $.ajax({
                url: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/".concat(
                    extraTeams[i]
                ),
                type: "GET",
                dataType: "json",
                cache: false,
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
}

// request extra games
function requestExtraNcaaGames() {
    for (let i = 0; i < extraGames.length; i++) {
        extraGameRequests.push(
            $.ajax({
                url: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard/".concat(
                    extraGames[i]
                ),
                type: "GET",
                dataType: "json",
                cache: false,
                success: function (res) {
                    game = getGame(res, 0);
                    if (game !== undefined) {
                        games.push(game);
                    }
                },
            })
        );
    }
}

// request nfl games
function requestNflGames() {
    requests.push(
        $.ajax({
            url: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
            type: "GET",
            dataType: "json",
            cache: false,
            success: function (res) {
                for (let i = 0; i < res.events.length; i++) {
                    game = getGame(res.events[i], 1);
                    if (game !== undefined) {
                        games.push(game);
                    }
                }
            },
        })
    );
}

// remove the games from the screen
function clearGamesScreen() {
    document.getElementById("container").innerHTML = "";
}

// clears the arrays holding the games and requests in order to get new ones
function clearGamesData() {
    games = [];
    requests = [];
    extraGameRequests = [];
    extraGames = [];
}

// filer the games given the button pressed
function filterClick(element, resetScroll) {
    var buttons = document.getElementsByClassName("button");
    var arr = [...buttons];
    var index = arr.indexOf(element);

    element.style.backgroundColor = "#242424";
    element.style.fontWeight = "bold";

    if (resetScroll) setCookie("scrollPos", 0, 14);

    if (index == 0) {
        renderGames("ncaa", 1);
        setCookie("filter", "ncaa", 14);
    } else if (index == 1) {
        renderGames("both", 1);
        setCookie("filter", "both", 14);
    } else {
        renderGames("nfl", 1);
        setCookie("filter", "nfl", 14);
    }

    arr.filter(function (item) {
        return item != element;
    }).forEach((item) => {
        item.style.backgroundColor = "#24242400";
        item.style.fontWeight = "";
    });
}

// send requests, filter games, and render
function requestGames() {
    clearGamesData();

    requestNcaaGames();
    requestExtraNcaaTeams();
    requestNflGames();

    // when ncaa, nfl, and extra teams are done, do extra games
    $.when.apply($, requests).done(function () {
        requestExtraNcaaGames();

        // now render the games
        $.when.apply($, extraGameRequests).done(function () {
            var filterCookie = getCookie("filter");
            var filter = filterCookie === "" ? "both" : filterCookie;
            filterClick(document.getElementById(filter + "-button"), 0);

            $(document).ready(function () {
                document.getElementById("container").style.visibility =
                    "visible";
                document.getElementById("buttons").style.visibility = "visible";
                document.getElementById("loading").style.display = "none";

                var scrollPos = getCookie("scrollPos");
                if (scrollPos) window.scrollTo(0, scrollPos);

                window.onbeforeunload = function (e) {
                    setCookie("scrollPos", window.scrollY, 14);
                };

                window.onpagehide = function (e) {
                    setCookie("scrollPos", window.scrollY, 14);
                };

                window.onscroll = function (e) {
                    setCookie("scrollPos", window.scrollY, 14);
                };
            });
        });
    });
}

// request games and get updates every 10 seconds
requestGames();
setInterval(requestGames, 10 * 1000);
