
const addTogether = function(obj1, obj2) {
  if (obj2.position > 0) {
    obj2.skgp = 1;
    obj2.glgp = 0;
    obj2.glso = 0;
  } else {
    obj2.skgp = 0;
    obj2.glgp = 1;
    obj2.glso = obj2.glga > 0 ? 0 : 1;
  }
  for (prop in obj1) {
    if (!isNaN(obj1[prop])) {
      obj1[prop] = parseInt(obj1[prop]) + parseInt(obj2[prop]);
    }
  }
  return obj1;
}

const firstGame = function(player) {
  if (player.position > 0) {
    player.skgp = 1;
    player.glgp = 0;
    player.glso = 0;
  } else {
    player.skgp = 0;
    player.glgp = 1;
    player.glso = player.glga > 0 ? 0 : 1;
  }
  return player;
}

export function playerStatsInGames() {
  const platform = process.env.PLATFORM;
  const club = process.env.CLUB_ID;
  let players = Meteor.http.call('GET', `http://www.easports.com/iframe/nhl14proclubs/api/platforms/${platform}/clubs/${club}/members`).data.raw[0];
  let members = [];
  for (player in players) {
    members.push(players[player].name);
  }
  let playerStats = {created_at: Date.now()};
  let forwardStats = {};
  let goalieStats = {};
  let defenderStats = {};
  const matches = Matches.find().fetch();
  for (match in matches) {
    if (matches[match].timestamp < 1473724800) { continue; } //skip before september 13 2016 (release day nhl 17)
    let players = matches[match].game_players;
    for (player in players) {
      let name = players[player].personaName;
      if (members.includes(name)) {
        if (players[player].position == 0) {
          goalieStats[name] = goalieStats[name] ? addTogether(goalieStats[name], players[player]) : firstGame(players[player]);
        }
        else if (players[player].position > 0 && players[player].position < 3) {
          defenderStats[name] = defenderStats[name] ? addTogether(defenderStats[name], players[player]) : firstGame(players[player]);
        } else {
          forwardStats[name] = forwardStats[name] ? addTogether(forwardStats[name], players[player]) : firstGame(players[player]);
        }
      }
    }
  }
  playerStats.forwards = forwardStats, playerStats.defenders = defenderStats, playerStats.goalies = goalieStats;
  PlayerStats.insert(playerStats);
}
