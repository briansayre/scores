function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

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

function numToQuart(num) {
    if (num === 4) return "4th";
    if (num === 3) return "3rd";
    if (num === 2) return "2nd";
    if (num === 1) return "1st";
    if (num === 0) return "";
    return "OT";
}

function renderDate(value, className) {
    var htmlObject = document.createElement("div");
    htmlObject.classList.add(className);
    htmlObject.innerHTML = value;
    document.getElementById("container").appendChild(htmlObject);
}

function renderGame(game) {
    var htmlObject = document.createElement("div");
    htmlObject.classList.add("game");
    htmlObject.onclick = function () {
        window.open(game.link);
    };
    var string = `
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
    htmlObject.innerHTML = string;
    document.getElementById("container").appendChild(htmlObject);
}

function getTeam(isAway, game, gameFormatted) {
    var t = game.competitors[isAway];
    var team = {};
    var state = gameFormatted.state;

    team.id = t.id;
    team.name = t.team.shortDisplayName;
    team.record = t.records !== undefined ? t.records[0].summary : "";
    team.possession = "hide";
    team.timeouts = ["hide", "hide", "hide"];
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
        if (team.id == gameFormatted.possession) {
            team.downAndDist = gameFormatted.downAndDist;
            team.possession = "show";
        }
        for (let i = 0; i < 3; i++) {
            team.timeouts[i] = "show";
        }
    }

    return team;
}

function getGame(g, isNfl) {
    var game = {};
    try {
        var comp = g.competitions !== undefined ? g.competitions[0] : {};
        if (comp == {}) {
            return;
        }

        game.state = g.status !== undefined ? g.status.type.state : "pre";
        game.link = g.links !== undefined ? g.links[0].href : "";
        game.venue = comp.venue.fullName;
        game.date = new Date(comp.startDate !== undefined ? comp.startDate : g.date);

        game.dateString =
            game.date.toLocaleDateString([], { weekday: "long" }) +
            " " +
            game.date.toLocaleDateString([], { month: "numeric", day: "numeric" });
        game.timeString = game.date.toLocaleTimeString([], { timeStyle: "short" });
        game.startDate = game.dateString + " - " + game.timeString;
        game.channel = comp.broadcasts[0].names !== undefined ? comp.broadcasts[0].names.join("/") : "";
        game.odds = comp.odds !== undefined ? " (" + comp.odds[0].details + " O/U " + comp.odds[0].overUnder + ")" : "";
        game.topHeader = [game.channel, game.venue, game.odds].filter(Boolean).join(" - ");
        game.lastPlay = " ";
        game.downAndDist = " ";
        game.possession = " ";
        game.live = " ";
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
            game.time = g.status.displayClock;
            game.quarter = numToQuart(g.status.period);
            game.live = "fa fa-circle text-danger-glow blink";
            console.log(g);
        }

        game.away = getTeam(1, comp, game);
        game.home = getTeam(0, comp, game);
    } catch (err) {
        throw err;
    }

    return game;
}

var games = [];
var requests = [];
var extraGameRequests = [];
var extraTeams = [66, 38, 2460, 2294];
var extraGames = [];

// ncaa
requests.push(
    $.ajax({
        url: "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",
        type: "GET",
        dataType: "json",
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

// when ncaa, nfl, and ectra teams are done, do extra games
$.when.apply($, requests).done(function () {
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

    $.when.apply($, extraGameRequests).done(function () {
        games.sort(function (a, b) {
            return a.date - b.date;
        });

        var prevDate = "";
        var prevTime = "";

        for (let i = 0; i < games.length; i++) {
            if (games[i].dateString !== prevDate) {
                renderDate(games[i].dateString, "game-date");
                prevDate = games[i].dateString;
            }
            if (games[i].timeString !== prevTime) {
                renderDate(games[i].timeString, "game-time");
                prevTime = games[i].timeString;
            }
            renderGame(games[i]);
        }

        $(document).ready(function () {
            document.getElementById("container").style.visibility = "visible";
            document.getElementById("loading").style.display = "none";

            var scrollpos = getCookie("scrollpos");
            if (scrollpos) window.scrollTo(0, scrollpos);

            window.onbeforeunload = function (e) {
                setCookie("scrollpos", window.scrollY, 14);
            };
        });
    });
});
