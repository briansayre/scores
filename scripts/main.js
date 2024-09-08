var games = [];
var newGames = [];
var shownGames = [];
var requests = [];
var extraGameRequests = [];
var extraGameIds = [];
var extraTeams = [66, 38, 2460, 2294, 275];
var debug = window.location.href === "https://briansayre.com/scores/" ? false : false;

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
    } else if (game.isFavorite) {
        htmlObject.classList.add("favorite-game");
    } else if (game.isGood) {
        htmlObject.classList.add("good-game");
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
            <div class="progress" style="color:${game.progressColor}">
                <div class="time">
                    ${game.time}
                </div>
                <div class="quarter">
                    ${game.quarter}
                </div>
            </div>
        </div>
        <div class="info">
            ${game.info}
        </div>
    `;
    htmlObject.innerHTML = htmlString;
    document.getElementById("container").appendChild(htmlObject);
}

// render the games given a filter mode
function renderGames() {
    
    shownGames = filterBasedOnSettings();
    
    shownGames.sort(function(a, b) {
        var nameA = a.home.name.toUpperCase();
        var nameB = b.home.name.toUpperCase();
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
    }).sort(function (a, b) {
        return a.date - b.date;
    });
    
    var prevDate = "";
    var prevTime = "";
    clearGamesScreen();
    
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
function filterBasedOnSettings() {
    var shownGames = games;

    var tab = getLocalStorage("tab");
    if (tab === null) ncaaSelection = "both";

    shownGames = shownGames.filter(function (game) {
        if (tab == "both") return 1;
        if (game.isNfl && tab == "nfl") return 1;
        if (!game.isNfl && tab == "ncaa") return 1;
        return 0;
    });

    var ncaaSelection = getLocalStorage("ncaaSelection");
    if (ncaaSelection === null) ncaaSelection = "ranked";

    shownGames = shownGames.filter(function (game) {
        if (!game.isNfl) {
            if (ncaaSelection === "ranked") {
                return oneTeamRanked(game) || containsExtra(game, extraTeams);
            } else if (ncaaSelection !== "all") {
                return containsConference(game, ncaaSelection);
            }
        }

        return 1;
    });

    return shownGames;
}

// remove the games from the screen
function clearGamesScreen() {
    document.getElementById("container").innerHTML = "";
}

// clears the arrays holding the new games and requests
function clearRequestsData() {
    newGames = [];
    extraGameIds = [];
    requests = [];
    extraGameRequests = [];
}

// request the extra teams
function requestExtraNcaaTeams() {
    for (let i = 0; i < extraTeams.length; i++) {
        requests.push(
            $.ajax({
                url: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/".concat(extraTeams[i]),
                type: "GET",
                dataType: "json",
                cache: false,
                success: function (res) {
                    var rank = res.team.rank !== undefined ? res.team.rank : 99;
                    if (rank > 25 && res.team.nextEvent !== undefined) {
                        id = res.team.nextEvent[0].id;
                        extraGameIds.push(id);
                    }
                },
            })
        );
    }
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
                        newGames.push(game);
                    }
                }
            },
        })
    );
}

// request extra games
function requestExtraNcaaGames() {
    for (let i = 0; i < extraGameIds.length; i++) {
        var foundGame = games.find((game) => {
            return game.id === extraGameIds[i];
        });
        if (foundGame === undefined) {
            extraGameRequests.push(
                $.ajax({
                    url: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard/".concat(extraGameIds[i]),
                    type: "GET",
                    dataType: "json",
                    cache: false,
                    success: function (res) {
                        game = new Game(res, 0);
                        if (game !== undefined) {
                            newGames.push(game);
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
                        newGames.push(game);
                    }
                }
            },
        })
    );
}

// filer the games given the button pressed
function tabClick(element) {
    if (element === undefined) {
        var tabStorage = getLocalStorage("tab");
        var tab = tabStorage === null ? "both" : tabStorage;
        element = document.getElementById(tab.trim() + "-button");
    }

    var buttons = document.getElementsByClassName("tab-button");
    var arr = [...buttons];

    element.style.backgroundColor = "var(--foreground)";
    element.style.border = "1px solid var(--border)";
    element.style.fontWeight = "bold";

    arr.filter(function (item) {
        return item != element;
    }).forEach((item) => {
        item.style.backgroundColor = "var(--transparent)";
        item.style.border = "0px";
        item.style.fontWeight = "";
    });

    setLocalStorage("tab", element.innerHTML.toLowerCase().trim());
    renderGames();
}

// open modal and load settings
function settingsClick() {
    var ncaaSelection = getLocalStorage("ncaaSelection");
    if (ncaaSelection === null) ncaaSelection = "all";
    document.getElementById(ncaaSelection).checked = true;
    document.getElementById("settings-modal").style.display = "block";
}

// save settings when the save button is clicked
function saveClick() {
    closeSettings();
    var ncaaSelection = document.querySelector('input[name="ncaa-selection"]:checked').value;
    if (ncaaSelection !== getLocalStorage("ncaaSelection")) {
        setLocalStorage("ncaaSelection", ncaaSelection);
        loadPage();
    }
}

// close modal
function closeSettings() {
    document.getElementById("settings-modal").style.display = "none";
}

// send requests, filter games, and render
function loadPage() {
    clearRequestsData();
    requestNcaaGames();
    requestExtraNcaaTeams();
    requestNflGames();

    // when ncaa, nfl, and extra teams are done, do extra games
    $.when.apply($, requests).done(function () {
        requestExtraNcaaGames();

        // now render the games
        $.when.apply($, extraGameRequests).done(function () {
            games = debug ? mock : newGames;
            tabClick();

            $(document).ready(function () {
                document.getElementById("container").style.visibility = "visible";
                document.getElementById("buttons").style.visibility = "visible";
                document.getElementById("loading").style.display = "none";
                document.getElementById("settings-button").style.display = "block";

                var scrollPos = getLocalStorage("scrollPos");
                if (scrollPos) window.scrollTo(0, scrollPos);

                window.onclick = function (e) {
                    if (e.target == document.getElementById("settings-modal")) {
                        closeSettings();
                    }
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
// if (!debug) setInterval(loadPage, 20 * 1000);
