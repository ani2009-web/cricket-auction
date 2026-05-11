import React, { useEffect, useMemo, useState } from "react";

const INITIAL_TEAMS = [
  {
    id: "team-a",
    name: "Team A",
    owner: "Owner 1",
    retained: [
      { id: "ra1", name: "Retained Batter", role: "Batter", amount: 14 },
      { id: "ra2", name: "Retained All-rounder", role: "All-rounder", amount: 11 }
    ],
    bought: []
  },
  {
    id: "team-b",
    name: "Team B",
    owner: "Owner 2",
    retained: [
      { id: "rb1", name: "Retained Bowler", role: "Bowler", amount: 10 }
    ],
    bought: []
  },
  {
    id: "team-c",
    name: "Team C",
    owner: "Owner 3",
    retained: [
      { id: "rc1", name: "Retained Keeper", role: "Wicketkeeper", amount: 12 },
      { id: "rc2", name: "Retained Spinner", role: "Bowler", amount: 8 },
      { id: "rc3", name: "Retained Finisher", role: "Batter", amount: 7 }
    ],
    bought: []
  },
  {
    id: "team-d",
    name: "Team D",
    owner: "Owner 4",
    retained: [],
    bought: []
  }
];

const INITIAL_PLAYERS = [
  { id: "p1", name: "Arjun Rao", role: "Top-order Batter", base: 2, status: "pending" },
  { id: "p2", name: "Kabir Sen", role: "Fast Bowler", base: 1.5, status: "pending" },
  { id: "p3", name: "Rishav Das", role: "Wicketkeeper", base: 1, status: "pending" },
  { id: "p4", name: "Dev Malik", role: "All-rounder", base: 2, status: "pending" },
  { id: "p5", name: "Sameer Khan", role: "Left-arm Spinner", base: 0.75, status: "pending" },
  { id: "p6", name: "Vivaan Mehta", role: "Finisher", base: 1.25, status: "pending" }
];

function safeNumber(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0;
  return number;
}

function formatMoney(value) {
  const number = safeNumber(value);
  return "Rs. " + number.toFixed(2) + " Cr";
}

function getBidIncrement(price) {
  const amount = safeNumber(price);
  if (amount < 1) return 0.05;
  if (amount < 2) return 0.1;
  if (amount < 5) return 0.2;
  return 0.25;
}

function sumAmounts(list) {
  return list.reduce(function (total, item) {
    return total + safeNumber(item.amount);
  }, 0);
}

function cloneInitialTeams() {
  return INITIAL_TEAMS.map(function (team) {
    return {
      id: team.id,
      name: team.name,
      owner: team.owner,
      retained: team.retained.map(function (player) { return { ...player }; }),
      bought: []
    };
  });
}

function cloneInitialPlayers() {
  return INITIAL_PLAYERS.map(function (player) {
    return { ...player };
  });
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    color: "#e5e7eb",
    fontFamily: "Arial, sans-serif",
    padding: 20
  },
  container: {
    maxWidth: 1280,
    margin: "0 auto"
  },
  header: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap"
  },
  title: {
    margin: "6px 0 0",
    fontSize: 36,
    lineHeight: 1.1,
    fontWeight: 900
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#94a3b8",
    maxWidth: 760
  },
  label: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#fbbf24"
  },
  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 14,
    marginBottom: 18
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, 0.95fr) minmax(360px, 1.7fr)",
    gap: 18
  },
  card: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16
  },
  darkBox: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 18,
    padding: 14
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: 14,
    padding: "12px 12px",
    fontSize: 15,
    marginTop: 8,
    outline: "none"
  },
  button: {
    border: 0,
    borderRadius: 14,
    padding: "12px 14px",
    fontWeight: 900,
    cursor: "pointer"
  },
  redButton: {
    background: "#ef4444",
    color: "white"
  },
  blueButton: {
    background: "#3b82f6",
    color: "white",
    width: "100%",
    marginTop: 12
  },
  greenButton: {
    background: "#10b981",
    color: "white",
    width: "100%"
  },
  grayButton: {
    background: "#475569",
    color: "white",
    width: "100%"
  },
  yellowButton: {
    background: "#fbbf24",
    color: "#020617",
    width: "100%",
    marginTop: 10
  },
  disabledButton: {
    background: "#334155",
    color: "#94a3b8",
    cursor: "not-allowed"
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
    marginTop: 12
  },
  statBox: {
    background: "#020617",
    borderRadius: 14,
    padding: 10,
    textAlign: "center"
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 14
  },
  twoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 12
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center"
  },
  playerItem: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8
  },
  retainedItem: {
    background: "rgba(251, 191, 36, 0.12)",
    border: "1px solid rgba(251, 191, 36, 0.25)",
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    fontSize: 13
  },
  boughtItem: {
    background: "rgba(16, 185, 129, 0.12)",
    border: "1px solid rgba(16, 185, 129, 0.25)",
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    fontSize: 13
  },
  smallMuted: {
    color: "#94a3b8",
    fontSize: 13
  }
};

function getStatusStyle(status) {
  if (status === "sold") {
    return { background: "rgba(16, 185, 129, 0.18)", color: "#86efac" };
  }
  if (status === "unsold") {
    return { background: "rgba(239, 68, 68, 0.18)", color: "#fca5a5" };
  }
  return { background: "#1e293b", color: "#cbd5e1" };
}

function statusPill(status) {
  return {
    ...getStatusStyle(status),
    borderRadius: 999,
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase"
  };
}

export default function App() {
  const [mode, setMode] = useState("retention");
  const [startingPurse, setStartingPurse] = useState(120);
  const [maxSlots, setMaxSlots] = useState(25);
  const [teams, setTeams] = useState(cloneInitialTeams());
  const [players, setPlayers] = useState(cloneInitialPlayers());
  const [currentBid, setCurrentBid] = useState(0);
  const [highestTeamId, setHighestTeamId] = useState("");
  const [auctionLog, setAuctionLog] = useState([]);
  const [newPlayer, setNewPlayer] = useState({ name: "", role: "", base: 1 });
  const [retentionForm, setRetentionForm] = useState({ teamId: "team-a", name: "", role: "", amount: 1 });

  const currentPlayer = players.find(function (player) {
    return player.status === "pending";
  }) || null;

  useEffect(function () {
    if (currentPlayer) {
      setCurrentBid(safeNumber(currentPlayer.base));
      setHighestTeamId("");
    }
  }, [currentPlayer ? currentPlayer.id : "none"]);

  const teamStats = useMemo(function () {
    return teams.map(function (team) {
      const retainedSpent = mode === "retention" ? sumAmounts(team.retained) : 0;
      const auctionSpent = sumAmounts(team.bought);
      const totalSpent = retainedSpent + auctionSpent;
      const retainedCount = mode === "retention" ? team.retained.length : 0;
      const squadCount = retainedCount + team.bought.length;
      return {
        ...team,
        retainedSpent: retainedSpent,
        auctionSpent: auctionSpent,
        totalSpent: totalSpent,
        squadCount: squadCount,
        remaining: safeNumber(startingPurse) - totalSpent
      };
    });
  }, [teams, mode, startingPurse]);

  const highestTeam = teamStats.find(function (team) {
    return team.id === highestTeamId;
  }) || null;

  const soldCount = players.filter(function (player) { return player.status === "sold"; }).length;
  const unsoldCount = players.filter(function (player) { return player.status === "unsold"; }).length;
  const pendingCount = players.filter(function (player) { return player.status === "pending"; }).length;

  const nextBidAmount = currentPlayer
    ? highestTeamId
      ? Number((currentBid + getBidIncrement(currentBid)).toFixed(2))
      : safeNumber(currentPlayer.base)
    : 0;

  function resetAuction() {
    setTeams(cloneInitialTeams());
    setPlayers(cloneInitialPlayers());
    setAuctionLog([]);
    setCurrentBid(INITIAL_PLAYERS[0].base);
    setHighestTeamId("");
  }

  function checkTeamCanBid(teamId, amount) {
    const team = teamStats.find(function (item) { return item.id === teamId; });
    if (!team || !currentPlayer) return { ok: false, reason: "No active player" };
    if (team.squadCount >= safeNumber(maxSlots)) return { ok: false, reason: "Squad full" };
    if (team.remaining < amount) return { ok: false, reason: "Insufficient purse" };
    return { ok: true, reason: "Can bid" };
  }

  function placeBid(teamId) {
    if (!currentPlayer) return;
    const check = checkTeamCanBid(teamId, nextBidAmount);
    if (!check.ok) return;
    setCurrentBid(nextBidAmount);
    setHighestTeamId(teamId);
  }

  function sellPlayer() {
    if (!currentPlayer || !highestTeamId) return;

    const soldPlayer = {
      id: currentPlayer.id,
      name: currentPlayer.name,
      role: currentPlayer.role,
      base: currentPlayer.base,
      amount: currentBid,
      status: "sold"
    };

    setTeams(function (previousTeams) {
      return previousTeams.map(function (team) {
        if (team.id !== highestTeamId) return team;
        return { ...team, bought: team.bought.concat([soldPlayer]) };
      });
    });

    setPlayers(function (previousPlayers) {
      return previousPlayers.map(function (player) {
        if (player.id !== currentPlayer.id) return player;
        return { ...player, status: "sold", soldTo: highestTeamId, amount: currentBid };
      });
    });

    setAuctionLog(function (previousLog) {
      return [{
        id: "log-" + Date.now(),
        type: "SOLD",
        player: currentPlayer.name,
        role: currentPlayer.role,
        team: highestTeam ? highestTeam.name : "Unknown Team",
        amount: currentBid
      }].concat(previousLog);
    });
  }

  function markUnsold() {
    if (!currentPlayer) return;

    setPlayers(function (previousPlayers) {
      return previousPlayers.map(function (player) {
        if (player.id !== currentPlayer.id) return player;
        return { ...player, status: "unsold" };
      });
    });

    setAuctionLog(function (previousLog) {
      return [{
        id: "log-" + Date.now(),
        type: "UNSOLD",
        player: currentPlayer.name,
        role: currentPlayer.role,
        team: "None",
        amount: 0
      }].concat(previousLog);
    });
  }

  function addAuctionPlayer(event) {
    event.preventDefault();
    const name = newPlayer.name.trim();
    if (!name) return;

    const player = {
      id: "p-" + Date.now(),
      name: name,
      role: newPlayer.role.trim() || "Player",
      base: safeNumber(newPlayer.base),
      status: "pending"
    };

    setPlayers(function (previousPlayers) {
      return previousPlayers.concat([player]);
    });

    setNewPlayer({ name: "", role: "", base: 1 });
  }

  function addRetainedPlayer(event) {
    event.preventDefault();
    const name = retentionForm.name.trim();
    if (!name) return;

    const retainedPlayer = {
      id: "r-" + Date.now(),
      name: name,
      role: retentionForm.role.trim() || "Player",
      amount: safeNumber(retentionForm.amount)
    };

    setTeams(function (previousTeams) {
      return previousTeams.map(function (team) {
        if (team.id !== retentionForm.teamId) return team;
        return { ...team, retained: team.retained.concat([retainedPlayer]) };
      });
    });

    setRetentionForm(function (previousForm) {
      return { ...previousForm, name: "", role: "", amount: 1 };
    });
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.label}>Cricket Auction Builder</div>
            <h1 style={styles.title}>IPL-style auction dashboard</h1>
            <p style={styles.subtitle}>
              Teams have fixed purse, retained players deduct budget, live bidding starts from base price, and sold players move to the winning team.
            </p>
          </div>
          <button onClick={resetAuction} style={{ ...styles.button, ...styles.redButton }}>
            Reset Demo
          </button>
        </header>

        <section style={styles.grid4}>
          <div style={styles.card}>
            <div style={styles.label}>Auction format</div>
            <select value={mode} onChange={function (event) { setMode(event.target.value); }} style={styles.input}>
              <option value="retention">Retention + Auction</option>
              <option value="fresh">Fresh Auction Only</option>
            </select>
          </div>

          <div style={styles.card}>
            <div style={styles.label}>Starting purse</div>
            <input
              type="number"
              min="1"
              step="0.5"
              value={startingPurse}
              onChange={function (event) { setStartingPurse(safeNumber(event.target.value)); }}
              style={styles.input}
            />
          </div>

          <div style={styles.card}>
            <div style={styles.label}>Max squad slots</div>
            <input
              type="number"
              min="1"
              value={maxSlots}
              onChange={function (event) { setMaxSlots(safeNumber(event.target.value)); }}
              style={styles.input}
            />
          </div>

          <div style={styles.card}>
            <div style={styles.label}>Auction status</div>
            <div style={styles.statGrid}>
              <div style={styles.statBox}><b>{soldCount}</b><br /><span style={styles.smallMuted}>Sold</span></div>
              <div style={styles.statBox}><b>{unsoldCount}</b><br /><span style={styles.smallMuted}>Unsold</span></div>
              <div style={styles.statBox}><b>{pendingCount}</b><br /><span style={styles.smallMuted}>Left</span></div>
            </div>
          </div>
        </section>

        <main style={styles.mainGrid}>
          <section>
            <div style={styles.card}>
              <div style={styles.label}>Player on stage</div>

              {currentPlayer ? (
                <div>
                  <h2 style={{ margin: "16px 0 6px", fontSize: 34 }}>{currentPlayer.name}</h2>
                  <p style={{ marginTop: 0, color: "#cbd5e1" }}>{currentPlayer.role}</p>

                  <div style={styles.twoGrid}>
                    <div style={styles.darkBox}>
                      <div style={styles.smallMuted}>Base price</div>
                      <h3>{formatMoney(currentPlayer.base)}</h3>
                    </div>
                    <div style={{ ...styles.darkBox, background: "#fbbf24", color: "#020617" }}>
                      <div>Current bid</div>
                      <h3>{formatMoney(currentBid)}</h3>
                    </div>
                  </div>

                  <div style={{ ...styles.darkBox, marginTop: 12 }}>
                    <div style={styles.smallMuted}>Highest bidder</div>
                    <h3 style={{ marginBottom: 4 }}>{highestTeam ? highestTeam.name : "No bid yet"}</h3>
                    <div style={styles.smallMuted}>Next valid bid: {formatMoney(nextBidAmount)}</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                    <button
                      onClick={sellPlayer}
                      disabled={!highestTeamId}
                      style={{ ...styles.button, ...styles.greenButton, ...(!highestTeamId ? styles.disabledButton : {}) }}
                    >
                      SOLD
                    </button>
                    <button onClick={markUnsold} style={{ ...styles.button, ...styles.grayButton }}>
                      UNSOLD
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ ...styles.darkBox, marginTop: 14, textAlign: "center" }}>
                  <h2>Auction complete</h2>
                  <p style={styles.smallMuted}>Add more players or reset the demo.</p>
                </div>
              )}
            </div>

            <div style={styles.card}>
              <div style={styles.label}>Add auction player</div>
              <form onSubmit={addAuctionPlayer}>
                <input
                  placeholder="Player name"
                  value={newPlayer.name}
                  onChange={function (event) { setNewPlayer({ ...newPlayer, name: event.target.value }); }}
                  style={styles.input}
                />
                <input
                  placeholder="Role"
                  value={newPlayer.role}
                  onChange={function (event) { setNewPlayer({ ...newPlayer, role: event.target.value }); }}
                  style={styles.input}
                />
                <input
                  type="number"
                  min="0.05"
                  step="0.05"
                  value={newPlayer.base}
                  onChange={function (event) { setNewPlayer({ ...newPlayer, base: safeNumber(event.target.value) }); }}
                  style={styles.input}
                />
                <button style={{ ...styles.button, ...styles.yellowButton }}>Add Player</button>
              </form>
            </div>

            <div style={styles.card}>
              <div style={styles.label}>Add retained player</div>
              <form onSubmit={addRetainedPlayer}>
                <select
                  value={retentionForm.teamId}
                  onChange={function (event) { setRetentionForm({ ...retentionForm, teamId: event.target.value }); }}
                  style={styles.input}
                >
                  {teams.map(function (team) {
                    return <option key={team.id} value={team.id}>{team.name}</option>;
                  })}
                </select>
                <input
                  placeholder="Retained player name"
                  value={retentionForm.name}
                  onChange={function (event) { setRetentionForm({ ...retentionForm, name: event.target.value }); }}
                  style={styles.input}
                />
                <input
                  placeholder="Role"
                  value={retentionForm.role}
                  onChange={function (event) { setRetentionForm({ ...retentionForm, role: event.target.value }); }}
                  style={styles.input}
                />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={retentionForm.amount}
                  onChange={function (event) { setRetentionForm({ ...retentionForm, amount: safeNumber(event.target.value) }); }}
                  style={styles.input}
                />
                <button style={{ ...styles.button, ...styles.yellowButton }}>Add Retention</button>
              </form>
            </div>
          </section>

          <section>
            <div style={styles.teamGrid}>
              {teamStats.map(function (team) {
                const canBid = checkTeamCanBid(team.id, nextBidAmount);
                const bidButtonStyle = canBid.ok
                  ? { ...styles.button, ...styles.blueButton }
                  : { ...styles.button, ...styles.blueButton, ...styles.disabledButton };

                return (
                  <div key={team.id} style={styles.card}>
                    <div style={styles.row}>
                      <div>
                        <h2 style={{ margin: 0 }}>{team.name}</h2>
                        <div style={styles.smallMuted}>{team.owner}</div>
                      </div>
                      <div style={{ ...styles.darkBox, textAlign: "right" }}>
                        <div style={styles.smallMuted}>Purse left</div>
                        <b>{formatMoney(team.remaining)}</b>
                      </div>
                    </div>

                    <div style={styles.statGrid}>
                      <div style={styles.statBox}><b>{formatMoney(team.retainedSpent)}</b><br /><span style={styles.smallMuted}>Retained</span></div>
                      <div style={styles.statBox}><b>{formatMoney(team.auctionSpent)}</b><br /><span style={styles.smallMuted}>Auction</span></div>
                      <div style={styles.statBox}><b>{team.squadCount}/{maxSlots}</b><br /><span style={styles.smallMuted}>Slots</span></div>
                    </div>

                    <button
                      onClick={function () { placeBid(team.id); }}
                      disabled={!currentPlayer || !canBid.ok}
                      style={bidButtonStyle}
                    >
                      Bid {formatMoney(nextBidAmount)}
                    </button>

                    {!canBid.ok && currentPlayer ? (
                      <p style={{ color: "#fca5a5", fontSize: 12, textAlign: "center" }}>{canBid.reason}</p>
                    ) : null}

                    <div style={{ marginTop: 12, maxHeight: 210, overflowY: "auto" }}>
                      {mode === "retention" ? team.retained.map(function (player) {
                        return (
                          <div key={player.id} style={styles.retainedItem}>
                            <b>{player.name}</b> - {player.role} - {formatMoney(player.amount)} retained
                          </div>
                        );
                      }) : null}

                      {team.bought.map(function (player) {
                        return (
                          <div key={player.id} style={styles.boughtItem}>
                            <b>{player.name}</b> - {player.role} - {formatMoney(player.amount)} bought
                          </div>
                        );
                      })}

                      {team.squadCount === 0 ? <p style={styles.smallMuted}>No players counted in this format.</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={styles.twoGrid}>
              <div style={styles.card}>
                <div style={styles.label}>Player queue</div>
                <div style={{ marginTop: 12, maxHeight: 420, overflowY: "auto" }}>
                  {players.map(function (player) {
                    return (
                      <div key={player.id} style={styles.playerItem}>
                        <div style={styles.row}>
                          <div>
                            <b>{player.name}</b>
                            <div style={styles.smallMuted}>{player.role} - Base {formatMoney(player.base)}</div>
                          </div>
                          <span style={statusPill(player.status)}>{player.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.label}>Auction log</div>
                <div style={{ marginTop: 12, maxHeight: 420, overflowY: "auto" }}>
                  {auctionLog.length === 0 ? <p style={styles.smallMuted}>No auction action yet.</p> : null}
                  {auctionLog.map(function (entry) {
                    return (
                      <div key={entry.id} style={styles.playerItem}>
                        <div style={styles.row}>
                          <b style={{ color: entry.type === "SOLD" ? "#86efac" : "#fca5a5" }}>{entry.type}</b>
                          <b>{entry.amount ? formatMoney(entry.amount) : "None"}</b>
                        </div>
                        <div style={{ marginTop: 6 }}><b>{entry.player}</b> - {entry.role}</div>
                        <div style={styles.smallMuted}>Team: {entry.team}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
