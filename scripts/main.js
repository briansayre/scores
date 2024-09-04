var games = [];
var shownGames = [];
var requests = [];
var extraGameRequests = [];
var extraGames = [];
var extraTeams = [66, 38, 2460, 2294, 275];

// set a local storage value
function setLocalStorage(name, value) {
    localStorage.setItem(name, value);
}

// get a local storage value
function getLocalStorage(name) {
    return localStorage.getItem(name);
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
            <span class="${game.live}"></span>${game.topHeader}
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
                        <div class="timeouts ${game.away.timeouts}">
                            <div class="${game.away.timeoutIcons[2]} timeout"></div>
                            <div class="${game.away.timeoutIcons[1]} timeout"></div>
                            <div class="${game.away.timeoutIcons[0]} timeout"></div>
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
                        <div class="timeouts ${game.home.timeouts}">
                            <div class="${game.home.timeoutIcons[2]} timeout"></div>
                            <div class="${game.home.timeoutIcons[1]} timeout"></div>
                            <div class="${game.home.timeoutIcons[0]} timeout"></div>
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

// render the games given a filter mode
function renderGames() {
    clearGamesScreen();

    shownGames = filterBasedOnSettings(games);

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

// filter games array based on settings and tab
function filterBasedOnSettings(games) {
    var tab = getLocalStorage("tab");
    if (tab === null) ncaaSelection = "both";
    games = games.filter(function (game) {
        if (tab == "both") return 1;
        if (game.isNfl && tab == "nfl") return 1;
        if (!game.isNfl && tab == "ncaa") return 1;
        return 0;
    });

    var ncaaSelection = getLocalStorage("ncaaSelection");
    if (ncaaSelection === null) ncaaSelection = "ranked";
    games = games.filter(function (game) {
        if (!game.isNfl && ncaaSelection == "ranked") {
            return oneTeamRanked(game) || containsExtra(game, extraTeams);
        }
        return 1;
    });

    return games;
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

// request ncaa games
function requestNcaaGames() {
    requests.push(
        $.ajax({
            url: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?groups=80",
            dataType: "json",
            cache: false,
            success: function (res) {
                for (let i = 0; i < res.events.length; i++) {
                    game = new Game(res.events[i], 0);
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
        var foundGame = games.find((game) => {
            return game.id === extraGames[i];
        });
        if (foundGame === undefined) {
            extraGameRequests.push(
                $.ajax({
                    url: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard/".concat(
                        extraGames[i]
                    ),
                    type: "GET",
                    dataType: "json",
                    cache: false,
                    success: function (res) {
                        game = new Game(res, 0);
                        if (game !== undefined) {
                            games.push(game);
                        }
                    },
                })
            );
        }
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
                    game = new Game(res.events[i], 1);
                    if (game !== undefined) {
                        games.push(game);
                    }
                }
            },
        })
    );
}

// filer the games given the button pressed
function tabClick(element, resetScroll) {
    var buttons = document.getElementsByClassName("tab-button");
    var arr = [...buttons];
    var index = arr.indexOf(element);

    element.style.backgroundColor = "#242424";
    element.style.fontWeight = "bold";

    if (resetScroll) setLocalStorage("scrollPos", 0);

    if (index == 0) {
        setLocalStorage("tab", "ncaa");
    } else if (index == 1) {
        setLocalStorage("tab", "both");
    } else {
        setLocalStorage("tab", "nfl");
    }

    renderGames();

    arr.filter(function (item) {
        return item != element;
    }).forEach((item) => {
        item.style.backgroundColor = "#00000000";
        item.style.fontWeight = "";
    });
}

function settingsClick() {
    var ncaaSelection = getLocalStorage("ncaaSelection");
    if (ncaaSelection !== null)
        document.getElementById(ncaaSelection).checked = true;
    document.getElementById("settings-modal").style.display = "block";
}

function saveClick() {
    var ncaaSelection = document.querySelector(
        'input[name="ncaa-selection"]:checked'
    ).value;
    setLocalStorage("ncaaSelection", ncaaSelection);
    closeSettings();
    loadPage();
}

function closeSettings() {
    document.getElementById("settings-modal").style.display = "none";
}

// send requests, filter games, and render
function loadPage() {
    clearGamesData();
    requestNcaaGames();
    requestExtraNcaaTeams();
    requestNflGames();

    // when ncaa, nfl, and extra teams are done, do extra games
    $.when.apply($, requests).done(function () {
        requestExtraNcaaGames();

        // now render the games
        $.when.apply($, extraGameRequests).done(function () {
            var tabCookie = getLocalStorage("tab");
            var tab = tabCookie === null ? "both" : tabCookie;

            tabClick(document.getElementById(tab + "-button"), 0);

            $(document).ready(function () {
                document.getElementById("container").style.visibility =
                    "visible";
                document.getElementById("buttons").style.visibility = "visible";
                document.getElementById("loading").style.display = "none";
                document.getElementById("settings-button").style.display =
                    "block";

                var scrollPos = getLocalStorage("scrollPos");
                if (scrollPos) window.scrollTo(0, scrollPos);

                window.onclick = function (e) {
                    if (e.target == document.getElementById("settings-modal")) {
                        closeSettings();
                    }
                };

                window.onbeforeunload = function (e) {
                    setLocalStorage("scrollPos", window.scrollY);
                };

                window.onpagehide = function (e) {
                    setLocalStorage("scrollPos", window.scrollY);
                };

                window.onscroll = function (e) {
                    setLocalStorage("scrollPos", window.scrollY);
                };
            });
        });
    });
}

// load page and get updates every 10 seconds
loadPage();
setInterval(loadPage, 10 * 1000);
