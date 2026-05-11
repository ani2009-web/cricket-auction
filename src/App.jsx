import React, { useMemo, useState } from "react";

const INITIAL_TEAMS = [
  { id: "team-a", name: "Team A", owner: "Owner 1", retained: [], bought: [] },
  { id: "team-b", name: "Team B", owner: "Owner 2", retained: [], bought: [] }
];

function safeNumber(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0;
  return number;
}

function formatLakhs(value) {
  const number = safeNumber(value);
  return "Rs. " + number.toFixed(2) + " L";
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
      retained: [],
      bought: []
    };
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
    maxWidth: 1320,
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
    gridTemplateColumns: "minmax(320px, 0.9fr) minmax(360px, 1.8fr)",
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
    background: "#38bdf8",
    color: "#020617",
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
  blackButton: {
    background: "#020617",
    border: "1px solid #334155",
    color: "#e5e7eb",
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
  const [startingPurse, setStartingPurse] = useState(1200);
  const [maxSlots, setMaxSlots] = useState(25);
  const [bidStep, setBidStep] = useState(5);
  const [teams, setTeams] = useState(cloneInitialTeams());
  const [players, setPlayers] = useState([]);
  const [currentBid, setCurrentBid] = useState(0);
  const [highestTeamId, setHighestTeamId] = useState("");
  const [auctionLog, setAuctionLog] = useState([]);
  const [newPlayer, setNewPlayer] = useState({ name: "", role: "", base: 10 });
  const [retentionForm, setRetentionForm] = useState({ teamId: "team-a", name: "", role: "", amount: 10 });
  const [teamForm, setTeamForm] = useState({ name: "", owner: "" });

  const currentPlayer = players.find(function (player) {
    return player.status === "pending";
  }) || null;

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

  const activeBid = currentPlayer ? currentBid || safeNumber(currentPlayer.base) : 0;
  const nextBidAmount = currentPlayer
    ? highestTeamId
      ? Number((activeBid + safeNumber(bidStep)).toFixed(2))
      : safeNumber(currentPlayer.base)
    : 0;

  function resetAuction() {
    setTeams(cloneInitialTeams());
    setPlayers([]);
    setAuctionLog([]);
    setCurrentBid(0);
    setHighestTeamId("");
    setNewPlayer({ name: "", role: "", base: 10 });
    setRetentionForm({ teamId: "team-a", name: "", role: "", amount: 10 });
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
      amount: activeBid,
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
        return { ...player, status: "sold", soldTo: highestTeamId, amount: activeBid };
      });
    });

    setAuctionLog(function (previousLog) {
      return [{
        id: "log-" + Date.now(),
        type: "SOLD",
        player: currentPlayer.name,
        role: currentPlayer.role,
        team: highestTeam ? highestTeam.name : "Unknown Team",
        amount: activeBid
      }].concat(previousLog);
    });

    setCurrentBid(0);
    setHighestTeamId("");
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

    setCurrentBid(0);
    setHighestTeamId("");
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

    if (!currentPlayer) {
      setCurrentBid(safeNumber(newPlayer.base));
      setHighestTeamId("");
    }

    setNewPlayer({ name: "", role: "", base: 10 });
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
      return { ...previousForm, name: "", role: "", amount: 10 };
    });
  }

  function addTeam(event) {
    event.preventDefault();
    const name = teamForm.name.trim();
    if (!name) return;

    const newTeam = {
      id: "team-" + Date.now(),
      name: name,
      owner: teamForm.owner.trim() || "Owner",
      retained: [],
      bought: []
    };

    setTeams(function (previousTeams) {
      return previousTeams.concat([newTeam]);
    });

    setTeamForm({ name: "", owner: "" });
  }

  function updateTeamName(teamId, field, value) {
    setTeams(function (previousTeams) {
      return previousTeams.map(function (team) {
        if (team.id !== teamId) return team;
        return { ...team, [field]: value };
      });
    });
  }

  function removeTeam(teamId) {
    setTeams(function (previousTeams) {
      if (previousTeams.length <= 1) return previousTeams;
      return previousTeams.filter(function (team) { return team.id !== teamId; });
    });

    if (highestTeamId === teamId) {
      setHighestTeamId("");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.label}>Cricket Auction Builder</div>
            <h1 style={styles.title}>General auction dashboard</h1>
            <p style={styles.subtitle}>
              Add your own teams, players, retained players, base prices, purse and bid increment. All money values are in lakhs.
            </p>
          </div>
          <button onClick={resetAuction} style={{ ...styles.button, ...styles.redButton }}>
            Clear All Demo Data
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
            <div style={styles.label}>Starting purse per team - lakhs</div>
            <input
              type="number"
              min="1"
              step="1"
              value={startingPurse}
              onChange={function (event) { setStartingPurse(safeNumber(event.target.value)); }}
              style={styles.input}
            />
          </div>

          <div style={styles.card}>
            <div style={styles.label}>Bid increment - lakhs</div>
            <input
              type="number"
              min="1"
              step="1"
              value={bidStep}
              onChange={function (event) { setBidStep(safeNumber(event.target.value)); }}
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

        <section style={styles.grid4}>
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
            <div style={styles.label}>Add team</div>
            <form onSubmit={addTeam}>
              <input
                placeholder="Team name"
                value={teamForm.name}
                onChange={function (event) { setTeamForm({ ...teamForm, name: event.target.value }); }}
                style={styles.input}
              />
              <input
                placeholder="Owner name"
                value={teamForm.owner}
                onChange={function (event) { setTeamForm({ ...teamForm, owner: event.target.value }); }}
                style={styles.input}
              />
              <button style={{ ...styles.button, ...styles.yellowButton }}>Add Team</button>
            </form>
          </div>

          <div style={styles.card}>
            <div style={styles.label}>Current player pool</div>
            <h2 style={{ marginBottom: 4 }}>{players.length}</h2>
            <div style={styles.smallMuted}>Add players manually with name, role and base price in lakhs.</div>
          </div>

          <div style={styles.card}>
            <div style={styles.label}>Money unit</div>
            <h2 style={{ marginBottom: 4 }}>Lakhs</h2>
            <div style={styles.smallMuted}>Example: 50 means Rs. 50 L. 1200 means Rs. 12 Cr.</div>
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
                      <h3>{formatLakhs(currentPlayer.base)}</h3>
                    </div>
                    <div style={{ ...styles.darkBox, background: "#fbbf24", color: "#020617" }}>
                      <div>Current bid</div>
                      <h3>{formatLakhs(activeBid)}</h3>
                    </div>
                  </div>

                  <div style={{ ...styles.darkBox, marginTop: 12 }}>
                    <div style={styles.smallMuted}>Highest bidder</div>
                    <h3 style={{ marginBottom: 4 }}>{highestTeam ? highestTeam.name : "No bid yet"}</h3>
                    <div style={styles.smallMuted}>Next valid bid: {formatLakhs(nextBidAmount)}</div>
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
                  <h2>No player on stage</h2>
                  <p style={styles.smallMuted}>Add auction players below. The first pending player will come on stage automatically.</p>
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
                  placeholder="Role / skill"
                  value={newPlayer.role}
                  onChange={function (event) { setNewPlayer({ ...newPlayer, role: event.target.value }); }}
                  style={styles.input}
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={newPlayer.base}
                  onChange={function (event) { setNewPlayer({ ...newPlayer, base: safeNumber(event.target.value) }); }}
                  style={styles.input}
                />
                <div style={styles.smallMuted}>Base price is in lakhs.</div>
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
                  placeholder="Role / skill"
                  value={retentionForm.role}
                  onChange={function (event) { setRetentionForm({ ...retentionForm, role: event.target.value }); }}
                  style={styles.input}
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={retentionForm.amount}
                  onChange={function (event) { setRetentionForm({ ...retentionForm, amount: safeNumber(event.target.value) }); }}
                  style={styles.input}
                />
                <div style={styles.smallMuted}>Retention amount is in lakhs and deducts from purse.</div>
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
                      <div style={{ flex: 1 }}>
                        <input
                          value={team.name}
                          onChange={function (event) { updateTeamName(team.id, "name", event.target.value); }}
                          style={{ ...styles.input, marginTop: 0, fontWeight: 900 }}
                        />
                        <input
                          value={team.owner}
                          onChange={function (event) { updateTeamName(team.id, "owner", event.target.value); }}
                          style={styles.input}
                        />
                      </div>
                      <div style={{ ...styles.darkBox, textAlign: "right" }}>
                        <div style={styles.smallMuted}>Purse left</div>
                        <b>{formatLakhs(team.remaining)}</b>
                      </div>
                    </div>

                    <div style={styles.statGrid}>
                      <div style={styles.statBox}><b>{formatLakhs(team.retainedSpent)}</b><br /><span style={styles.smallMuted}>Retained</span></div>
                      <div style={styles.statBox}><b>{formatLakhs(team.auctionSpent)}</b><br /><span style={styles.smallMuted}>Auction</span></div>
                      <div style={styles.statBox}><b>{team.squadCount}/{maxSlots}</b><br /><span style={styles.smallMuted}>Slots</span></div>
                    </div>

                    <button
                      onClick={function () { placeBid(team.id); }}
                      disabled={!currentPlayer || !canBid.ok}
                      style={bidButtonStyle}
                    >
                      Bid {formatLakhs(nextBidAmount)}
                    </button>

                    {!canBid.ok && currentPlayer ? (
                      <p style={{ color: "#fca5a5", fontSize: 12, textAlign: "center" }}>{canBid.reason}</p>
                    ) : null}

                    <button
                      onClick={function () { removeTeam(team.id); }}
                      style={{ ...styles.button, ...styles.blackButton }}
                    >
                      Remove Team
                    </button>

                    <div style={{ marginTop: 12, maxHeight: 210, overflowY: "auto" }}>
                      {mode === "retention" ? team.retained.map(function (player) {
                        return (
                          <div key={player.id} style={styles.retainedItem}>
                            <b>{player.name}</b> - {player.role} - {formatLakhs(player.amount)} retained
                          </div>
                        );
                      }) : null}

                      {team.bought.map(function (player) {
                        return (
                          <div key={player.id} style={styles.boughtItem}>
                            <b>{player.name}</b> - {player.role} - {formatLakhs(player.amount)} bought
                          </div>
                        );
                      })}

                      {team.squadCount === 0 ? <p style={styles.smallMuted}>No players in this team yet.</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={styles.twoGrid}>
              <div style={styles.card}>
                <div style={styles.label}>Player queue</div>
                <div style={{ marginTop: 12, maxHeight: 420, overflowY: "auto" }}>
                  {players.length === 0 ? <p style={styles.smallMuted}>No players added yet.</p> : null}
                  {players.map(function (player) {
                    return (
                      <div key={player.id} style={styles.playerItem}>
                        <div style={styles.row}>
                          <div>
                            <b>{player.name}</b>
                            <div style={styles.smallMuted}>{player.role} - Base {formatLakhs(player.base)}</div>
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
                          <b>{entry.amount ? formatLakhs(entry.amount) : "None"}</b>
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
